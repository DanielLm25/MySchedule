<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuthorizedUser extends Model
{
  use HasFactory;

  protected $fillable = [
    'owner_user_id',
    'authorized_user_id'
  ];

  public function owner()
  {
    return $this->belongsTo(User::class, 'owner_user_id');
  }

  public function authorizedUser()
  {
    return $this->belongsTo(User::class, 'authorized_user_id');
  }
}
