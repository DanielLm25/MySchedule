<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuthorizedUser extends Model
{
  protected $fillable = [
    'owner_user_id', // ID do usuário que possui a agenda protegida
    'authorized_user_id', // ID do usuário autorizado a acessar a agenda
  ];

  // Defina os relacionamentos conforme sua estrutura de banco de dados
}
