<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query');
        $authenticatedUser = Auth::user();

        $results = [];

        // Busca por eventos que correspondem ao termo de pesquisa e pertencem ao usuário autenticado
        $userEvents = Event::where('title', 'LIKE', "%{$query}%")
            ->where('user_id', $authenticatedUser->id)
            ->get();

        foreach ($userEvents as $event) {
            $results[] = ['type' => 'event', 'data' => $event];
        }

        // Busca por eventos de outros usuários que correspondem ao termo de pesquisa
        $otherUserEvents = Event::where('title', 'LIKE', "%{$query}%")
            ->where('user_id', '!=', $authenticatedUser->id)
            ->get();

        foreach ($otherUserEvents as $event) {
            $user = User::find($event->user_id);

            // Verificar a permissão do tipo de agenda do usuário
            if ($user->permission_type === 'private') {
                continue; // Ignorar eventos de usuários com agenda privada
            }

            if ($user->permission_type === 'protected' && $user->id !== $authenticatedUser->id) {
                continue; // Ignorar eventos de usuários com agenda protegida que não são do próprio usuário autenticado
            }

            // Adicionar o evento à lista de resultados
            $results[] = ['type' => 'event', 'data' => $event];
        }

        // Busca por usuários que correspondem ao termo de pesquisa
        $users = User::where('name', 'LIKE', "%{$query}%")->get();

        foreach ($users as $user) {
            // Adicionar o usuário à lista de resultados
            $results[] = ['type' => 'user', 'data' => $user];
        }

        return response()->json($results);
    }

    public function getUserAgenda(Request $request, $id)
    {
        $authenticatedUser = Auth::user();
        $user = User::findOrFail($id);

        // Verificar a permissão do tipo de agenda do usuário
        if ($user->permission_type === 'private' && $user->id !== $authenticatedUser->id) {
            return response()->json(['error' => 'Esta agenda é privada.'], 403);
        }

        if ($user->permission_type === 'protected' && $user->id !== $authenticatedUser->id) {
            // Verificar se foi fornecido o token de acesso
            if (!$request->has('token')) {
                return response()->json(['error' => 'Token de acesso não fornecido.'], 403);
            }

            // Buscar o access_code do usuário alvo
            $accessCode = $user->access_code;

            // Verificar se o token fornecido corresponde ao access_code do usuário
            if ($request->input('token') !== $accessCode) {
                return response()->json(['error' => 'Token de acesso inválido.'], 403);
            }

            // Log para verificar o acesso bem-sucedido
            Log::info("Usuário {$authenticatedUser->name} acessou a agenda protegida de {$user->name}.");
        }

        // Carregar os eventos associados ao usuário
        $events = Event::where('user_id', $user->id)->get();

        return response()->json($events);
    }
}
