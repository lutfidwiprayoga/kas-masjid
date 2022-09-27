<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donasi extends Model
{
    use HasFactory;
    protected $fillable = [
        'nama', 'user_id', 'no_rek', 'jenis_rek', 'jumlah', 'tanggal', 'foto', 'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function keuangan()
    {
        return $this->hasMany(Keuangan::class);
    }
}
