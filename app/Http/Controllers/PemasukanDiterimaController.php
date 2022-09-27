<?php

namespace App\Http\Controllers;

use App\Models\Keuangan;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PemasukanDiterimaController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $pemasukan_dn = Keuangan::join('donasis', 'keuangans.donasi_id', '=', 'donasis.id')
            ->where('keuangans.status', '=', 'pemasukan')
            ->where('donasis.status', '=', 'Diterima')
            ->whereIn('keuangans.deskripsi', ['Bantuan Donasi'])->get();
        $validasi = Keuangan::join('donasis', 'donasis.id', '=', 'keuangans.donasi_id')
            ->where('keuangans.status', '=', 'pemasukan')
            ->where('donasis.status', '=', 'Diverifikasi')
            ->whereIn('keuangans.deskripsi', ['Bantuan Donasi'])->get();
        $ditolak = Keuangan::join('donasis', 'donasis.id', '=', 'keuangans.donasi_id')
            ->where('keuangans.status', '=', 'pemasukan')
            ->where('donasis.status', '=', 'ditolak')
            ->whereIn('keuangans.deskripsi', ['Bantuan Donasi'])->get();
        return view('pemasukan.donasi-masuk.index', compact('now', 'pemasukan_dn', 'validasi', 'ditolak'), [
            'title' => 'Pemasukan Donasi'
        ]);
    }
}
