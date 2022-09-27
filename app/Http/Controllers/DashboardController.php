<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Donasi;
use App\Models\Keuangan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }
    public function index()
    {

        $data = Artikel::all();
        $now = Carbon::now();
        $donasi = Donasi::all()->count();
        $pengeluaran = Keuangan::sum('pengeluaran');
        $pemasukan = Keuangan::sum('pemasukan');
        $total_saldo = Keuangan::all()->last();
        $rekap = DB::table('keuangans')->whereNotIn('status', [!null])
            ->select(
                DB::raw('DATE_FORMAT(tanggal,"%M") as month'),
                DB::raw('SUM(pemasukan) as kas_masuk'),
                DB::raw('SUM(pengeluaran) as kas_keluar')
            )
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->get();
        // $rekap = Keuangan::selectRaw('monthname(tanggal)month')->groupBy('month')->get();
        $bulan = [];
        $masuk = [];
        $keluar = [];
        foreach ($rekap as $key) {
            $bulan[] = $key->month;
            $masuk[] = $key->kas_masuk;
            $keluar[] = $key->kas_keluar;
        }
        // dd($bulan);
        return view('home', compact('data', 'now', 'donasi', 'pengeluaran', 'pemasukan', 'total_saldo', 'bulan', 'masuk', 'keluar'), [
            'title' => 'Dashboard'
        ]);
    }
}
