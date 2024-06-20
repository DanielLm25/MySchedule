<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query');
        $user = Auth::user();

        // Busca por eventos que correspondem ao termo de pesquisa e pertencem ao usuário autenticado
        $events = Event::where('user_id', $user->id)
            ->where('title', 'LIKE', "%{$query}%")
            ->get();

        // Busca por usuários que correspondem ao termo de pesquisa
        $users = User::where('name', 'LIKE', "%{$query}%")->get();

        $results = [];

        foreach ($events as $event) {
            $results[] = ['type' => 'event', 'data' => $event];
        }

        foreach ($users as $user) {
            // Carregar os eventos associados a cada usuário
            $userWithEvents = $user->load('events');
            $results[] = ['type' => 'user', 'data' => $userWithEvents];
        }

        return response()->json($results);
    }
}
