<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class PDFController extends Controller
{
    public $bulan;

    public function cetakPDF(Request $request)
    {
        $bulan_id = $request->input('bulan_id');
        $show = DB::table('keuangans')
        ->where('tanggal', 'LIKE', '%'.$bulan_id.'%')
        ->whereNotIn('status',[!null])
        ->get();
        // dd($bulan_id);
        $pdf = Pdf::loadView('donasi.pdf',compact('show','bulan_id'))->setPaper('A4','Potrait');
        return $pdf->download('rekap-donasi.pdf');
    }
}
