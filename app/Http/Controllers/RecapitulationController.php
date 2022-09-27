<?php

namespace App\Http\Controllers;

use App\Models\Keuangan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecapitulationController extends Controller
{
    public function index(Request $request)
    {
        // $tanggal_awal = Carbon::parse(request()->tanggal_awal)->format('Y-m-d H:i:s');
        // $tanggal_akhir = Carbon::parse(request()->tanggal_akhir)->format('Y-m-d H:i:s');
        $bulan = $request->input('bulan');
        $date = Carbon::parse($bulan)->format('Y-m');
        $rekape = DB::table('keuangans')
            // ->join('donasis', 'keuangans.donasi_id', '=', 'donasis.id')
            // ->where('keuangans.tanggal', 'LIKE', '%' . $bulan . '%')
            // ->where('donasis.status', 'Diterima')
            ->whereNotIn('status', [!null])
            ->select(
                // DB::raw('month(tanggal)as months'),
                DB::raw('monthname(tanggal)as month'),
                DB::raw('sum(pemasukan) as kas_masuk'),
                DB::raw('sum(pengeluaran) as kas_keluar'),
                DB::raw('sum(pemasukan)+ sum(pengeluaran) as total_saldo_semua'),
                DB::raw('sum(pemasukan)- sum(pengeluaran) as total_saldo')
            )
            ->groupBy('month')
            ->orderBy('tanggal', 'asc')
            ->get();
        $saldo_terakhir = DB::table('keuangans')->pluck('saldo')->last();
        $show = DB::table('keuangans')
            // ->join('donasis', 'keuangans.donasi_id', '=', 'donasis.id')
            ->where('tanggal', 'LIKE', '%' . $bulan . '%')
            // ->where('donasis.status', 'Diterima')
            ->whereNotIn('status', [!null])
            ->get();
        // dd($bulan,$date);
        return view('recapitulation', ['title' => 'Rekapitulasi'], compact('rekape', 'show', 'date', 'saldo_terakhir'));
    }
}
