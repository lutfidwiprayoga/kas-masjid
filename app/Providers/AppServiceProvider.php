<?php

namespace App\Providers;

use App\Models\Artikel;
use App\Models\Donasi;
use App\Models\Keuangan;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        view()->composer('*', function ($view) {
            $title = 'Dashboard';
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
            $bulan = [];
            $masuk = [];
            $keluar = [];
            foreach ($rekap as $key) {
                $bulan[] = $key->month;
                $masuk[] = $key->kas_masuk;
                $keluar[] = $key->kas_keluar;
            }
            // dd($bulan);
            $view->with([
                'title' => $title,
                'data' => $data, 'now' => $now,
                'donasi' => $donasi,
                'pengeluaran' => $pengeluaran,
                'pemasukan' => $pemasukan,
                'total_saldo' => $total_saldo,
                'rekap' => $rekap,
                'bulan' => $bulan,
                'masuk' => $masuk, 'keluar' => $keluar
            ]);
        });
    }
}
