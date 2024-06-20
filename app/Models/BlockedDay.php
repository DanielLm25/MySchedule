<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlockedDay extends Model
{
  protected $fillable = [
    'user_id', 'type', 'start_date', 'end_date', 'specific_dates', 'recurring_days', 'reason',

  ];

  protected $casts = [
    'specific_dates' => 'array',
    'recurring_days' => 'array',
  ];

  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
