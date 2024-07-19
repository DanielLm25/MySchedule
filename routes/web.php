<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventController;
use Inertia\Inertia;
use App\Http\Controllers\Auth\GoogleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SearchController;
use App\Models\User;  // Importe o modelo User
use App\Http\Controllers\BlockedDayController;  // Importe o BlockedDayController
use Illuminate\Support\Facades\Auth;


use App\Http\Controllers\UserController;

Route::post('/user/{id}/access', [UserController::class, 'verifyAccessToken']);



Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle'])->name('google.login')->middleware('web');
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => app()->version(),
        'phpVersion' => PHP_VERSION,
    ]);
});

// Rota de dashboard protegida por autenticação
Route::middleware(['auth', 'verified'])->group(function () {
    // Rota para busca
    Route::post('/profile/update-permission-type', [ProfileController::class, 'updatePermissionType'])->name('profile.updatePermissionType');

    Route::get('/search', [SearchController::class, 'search']);

    // Rota para buscar agenda do usuário
    Route::get('/user/{id}/agenda', function ($id) {
        $user = User::findOrFail($id);
        $events = $user->events; // Supondo que 'events' é o relacionamento na model User
        return response()->json($events);
    });

    // Rota de dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Rotas de perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');



    // Recurso para EventController
    Route::resource('events', EventController::class)->middleware('auth');

    // Recurso para BlockedDayController
    Route::post('/blocked-days', [BlockedDayController::class, 'store']);
    Route::get('/blocked-days', [BlockedDayController::class, 'index']);
    Route::delete('/blocked-days/{blocked_day}', [BlockedDayController::class, 'destroy'])->name('blocked-days.destroy');
});


// Incluir rotas de autenticação padrão do Laravel
require __DIR__ . '/auth.php';
