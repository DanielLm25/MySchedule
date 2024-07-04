<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use App\Models\User;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'permission_type' => $request->user()->permission_type,
                'access_code' => $request->user()->access_code,
            ],
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'Profile updated successfully.');
    }

    public function updatePermissionType(Request $request)
    {
        $request->validate([
            'permission_type' => 'required|string|in:public,private,protected',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->permission_type = $request->permission_type;

        // Se o tipo de permissão for 'protected', gerar um código de acesso único
        if ($request->permission_type === 'protected') {
            $user->access_code = strtoupper(Str::random(8)); // Gerar um código de acesso aleatório (exemplo)
            $user->access_code_expires_at = now()->addHours(1); // Definir expiração para 1 hora após agora
        } else {
            $user->access_code = null; // Limpar o código de acesso se não for 'protected'
            $user->access_code_expires_at = null; // Limpar a expiração
        }

        $user->save(); // O Laravel gerenciará automaticamente updated_at e created_at

        return response()->json(['access_code' => $user->access_code], 200);
    }


    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
