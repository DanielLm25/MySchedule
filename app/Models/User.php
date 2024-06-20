<?php

// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'permission_type', 'access_code'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Define o relacionamento com os eventos do usuário.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function events()
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Define o relacionamento com os usuários autorizados.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function authorized_users()
    {
        return $this->hasMany(AuthorizedUser::class, 'owner_user_id');
    }

    /**
     * Define o relacionamento com os dias bloqueados pelo usuário.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function blockedDays(): HasMany
    {
        return $this->hasMany(BlockedDay::class);
    }
}
