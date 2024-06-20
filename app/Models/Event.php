<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
  use HasFactory;

  protected $fillable = [
    'title', 'description', 'date', 'time', 'color', 'recurrence', 'days_of_week', 'user_id'
  ];

  protected $casts = [
    'days_of_week' => 'array',
  ];

  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
