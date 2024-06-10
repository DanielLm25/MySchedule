<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
  use HasFactory;

  use HasFactory;

  protected $fillable = [
    'title', 'description', 'date', 'time', 'color', 'recurrence', 'days_of_week',
  ];

  protected $casts = [
    'days_of_week' => 'array',
  ];
}
