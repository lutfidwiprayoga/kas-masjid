<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artikel extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id','title', 'deskripsi', 'foto'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
