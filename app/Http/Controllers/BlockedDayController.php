<?php

namespace App\Http\Controllers;

use App\Models\BlockedDay;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlockedDayController extends Controller
{
    /**
     * Exibe os dias bloqueados do usuário logado.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Obter o user_id da requisição ou usar o ID do usuário autenticado
        $userId = $request->query('user_id', Auth::id());

        // Recuperar os dias bloqueados para o user_id fornecido
        $blockedDays = BlockedDay::where('user_id', $userId)->get();

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
        $validated = $request->validate([
            'type' => 'required|in:range,specific,recurring',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'specific_dates' => 'nullable|array',
            'recurring_days' => 'nullable|array',
            'reason' => 'required|string|max:255',
        ]);

        $blockedDay = BlockedDay::create([
            'user_id' => Auth::id(),
            'type' => $validated['type'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'specific_dates' => $validated['specific_dates'],
            'recurring_days' => $validated['recurring_days'],
            'reason' => $validated['reason'],
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
        $validated = $request->validate([
            'type' => 'required|in:range,specific,recurring',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'specific_dates' => 'nullable|array',
            'recurring_days' => 'nullable|array',
            'reason' => 'required|string|max:255',
        ]);

        $blockedDay = BlockedDay::findOrFail($id);

        // Verificar se o dia bloqueado pertence ao usuário logado
        if ($blockedDay->user_id !== Auth::id()) {
            return response()->json(['error' => 'Acesso não autorizado'], 403);
        }

        $blockedDay->update([
            'type' => $validated['type'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'specific_dates' => $validated['specific_dates'],
            'recurring_days' => $validated['recurring_days'],
            'reason' => $validated['reason'],
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
        // Buscar o dia bloqueado pelo ID
        $blockedDay = BlockedDay::findOrFail($id);

        // Verificar se o dia bloqueado pertence ao usuário logado
        if ($blockedDay->user_id !== Auth::id()) {
            return response()->json(['error' => 'Acesso não autorizado'], 403);
        }

        // Excluir o dia bloqueado
        $blockedDay->delete();

        return response()->json(['message' => 'Dia bloqueado removido com sucesso']);
    }
}
