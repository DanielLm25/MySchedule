<?php

namespace App\Http\Controllers;

use App\Models\BlockedDay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class BlockedDayController extends Controller
{
    /**
     * Exibe os dias bloqueados do usuário logado.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();

        // Verificar se o usuário está autenticado
        if (!$user) {
            return response()->json(['error' => 'Usuário não autenticado'], 401);
        }

        // Obter os dias bloqueados do usuário utilizando a relação definida
        $blockedDays = $user->blockedDays()->get();

        return response()->json($blockedDays);
    }

    /**
     * Armazena um novo dia bloqueado.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:range,specific,recurring',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'specific_dates' => 'nullable|array',
            'recurring_days' => 'nullable|array',
        ]);

        $blockedDay = BlockedDay::create([
            'user_id' => Auth::id(),
            'type' => $request->type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'specific_dates' => $request->specific_dates,
            'recurring_days' => $request->recurring_days,
        ]);

        return response()->json($blockedDay, 201);
    }

    /**
     * Exibe um dia bloqueado específico.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $blockedDay = BlockedDay::findOrFail($id);

        // Verificar se o dia bloqueado pertence ao usuário logado
        if ($blockedDay->user_id !== Auth::id()) {
            return response()->json(['error' => 'Acesso não autorizado'], 403);
        }

        return response()->json($blockedDay);
    }

    /**
     * Atualiza um dia bloqueado específico.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'type' => 'required|in:range,specific,recurring',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'specific_dates' => 'nullable|array',
            'recurring_days' => 'nullable|array',
        ]);

        $blockedDay = BlockedDay::findOrFail($id);

        // Verificar se o dia bloqueado pertence ao usuário logado
        if ($blockedDay->user_id !== Auth::id()) {
            return response()->json(['error' => 'Acesso não autorizado'], 403);
        }

        $blockedDay->update([
            'type' => $request->type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'specific_dates' => $request->specific_dates,
            'recurring_days' => $request->recurring_days,
        ]);

        return response()->json($blockedDay);
    }

    /**
     * Remove um dia bloqueado específico.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $blockedDay = BlockedDay::findOrFail($id);

        // Verificar se o dia bloqueado pertence ao usuário logado
        if ($blockedDay->user_id !== Auth::id()) {
            return response()->json(['error' => 'Acesso não autorizado'], 403);
        }

        $blockedDay->delete();

        return response()->json(['message' => 'Dia bloqueado removido com sucesso']);
    }
}
