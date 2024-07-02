<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
  public function updateAgendaProtectionType(Request $request, $id)
  {
    $user = User::findOrFail($id);

    $request->validate([
      'permission_type' => 'required|string|in:public,private,protected',
    ]);

    $user->update([
      'permission_type' => $request->permission_type,
    ]);

    return response()->json(['message' => 'Agenda protection type updated successfully'], 200);
  }

  public function verifyAccessToken($id, Request $request)
  {
    $request->validate([
      'token' => 'required|string',
    ]);

    $user = User::findOrFail($id);

    if ($user->permission_type !== 'protected' || $user->access_code !== $request->token) {
      return response()->json(['error' => 'Access denied. Invalid token.'], 403);
    }

    $events = $user->events;
    return response()->json($events);
  }
}
