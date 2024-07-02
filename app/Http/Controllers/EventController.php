<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;

use App\Jobs\CheckEventsQueueJob;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::where('user_id', auth()->user()->id)->get();
        return response()->json($events);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'color' => 'nullable|string|max:7',
            'recurrence' => 'nullable|string',
            'days_of_week' => 'nullable|array',
            'days_of_week.*' => 'integer|min:0|max:6',
            'user_id' => 'required|exists:users,id', // Validar user_id
        ]);

        // Recuperar o usuário cuja agenda estamos visualizando (user2)
        $targetUser = User::findOrFail($validated['user_id']);

        // Verificar se o usuário autenticado pode criar eventos na agenda do usuário alvo (user2)
        if (!$this->canCreateEventInUserAgenda(auth()->user(), $targetUser)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Adicionar o user_id do usuário alvo (user2) ao evento a ser criado
        $validated['user_id'] = $targetUser->id;

        // Cria o evento associado ao usuário alvo (user2)
        $event = Event::create($validated);

        return response()->json($event, 201);
    }

    public function update(Request $request, Event $event)
    {
        if ($event->user_id !== auth()->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'color' => 'nullable|string|max:7',
            'recurrence' => 'nullable|string',
            'days_of_week' => 'nullable|array',
            'days_of_week.*' => 'integer|min:0|max:6',
        ]);

        $event->update($validated);

        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        if ($event->user_id !== auth()->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted']);
    }

    public function search(Request $request)
    {
        $term = $request->input('term');

        $events = Event::where('user_id', auth()->id())
            ->where('title', 'like', '%' . $term . '%')
            ->get();

        return response()->json($events);
    }

    protected function canCreateEventInUserAgenda(User $authUser, User $targetUser)
    {
        // Verifica o tipo de permissão da agenda do usuário alvo
        switch ($targetUser->permission_type) {
            case 'public':
                // Se for pública, qualquer usuário pode criar eventos
                return true;
            case 'private':
                // Se for privada, apenas o próprio usuário pode criar eventos
                return $authUser->id === $targetUser->id;
            case 'protected':
                // Verificar se o usuário autenticado está autorizado a criar eventos
                return $this->userIsAuthorizedForProtectedAgenda($authUser, $targetUser);
            default:
                return false;
        }
    }

    protected function userIsAuthorizedForProtectedAgenda(User $authUser, User $targetUser)
    {
        // Verifica se o usuário autenticado é o próprio usuário alvo
        // ou se está na lista de usuários autorizados na agenda do usuário alvo
        return $authUser->id === $targetUser->id ||
            $targetUser->authorized_users()
            ->where('authorized_user_id', $authUser->id)
            ->exists();
    }
}
