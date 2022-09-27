<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keuangan extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id', 'tanggal', 'deskripsi', 'status','pemasukan', 'pengeluaran', 'saldo', 'foto'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
    public function rekap(){
        return $this->hasMany(Rekapitulasi::class);
    }

    public function donasi(){
        return $this->belongsTo(Donasi::class,'donasi_id','id');
    }
}
