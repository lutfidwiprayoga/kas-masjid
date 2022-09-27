<?php

namespace App\Http\Controllers;

use App\Models\Keuangan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use RealRashid\SweetAlert\Facades\Alert;
use Illuminate\Support\Facades\Auth;

class PengeluaranController extends Controller
{
    public function index(){

        $now = Carbon::now();
        $item = Keuangan::where('status', 'pengeluaran')->get();
        return view('pengeluaran.index', compact('now', 'item'), [
            'title' => 'Pengluaran'
        ]);
    }

    public function store(Request $request){
// dd($request->all());
        $data = Keuangan::get();
        $pengeluaran = new Keuangan();
        $pengeluaran->user_id = Auth::user()->id;
        $pengeluaran->tanggal = $request->tanggal;
        $pengeluaran->deskripsi = $request->deskripsi;
        $pengeluaran->pengeluaran = $request->pengeluaran;
        $pengeluaran->status = $request->status;
        foreach ($data as $item) {
            $pengeluaran->saldo = $item->saldo - $request->pengeluaran;
        }
        if($request->hasFile('foto')){
            $request->file('foto')->move('foto/',$request->file('foto')->getClientOriginalName());
            $pengeluaran->foto = $request->file('foto')->getClientOriginalName();
            $pengeluaran->save();
        }
        Alert::success('Success Add Data');
        return redirect('/pengeluaran')->with('succes', 'Data berhasil di simpan');
    }

    public function update(Request $request, $id){

        $data = Keuangan::find($id);
        $data->tanggal = $request->tanggal;
        $data->deskripsi = $request->deskripsi;
        $data->pengeluaran = $request->pengeluaran;
        $data->status = $request->status;
        $data->save();
        Alert::success('Success Updating Data');
        return redirect('/pengeluaran');

    }

    public function destroy($id){

        $data = Keuangan::find($id);
        $data->delete();
        Alert::success('Success Delete Data');
        return redirect('/pengeluaran')->with('succes', 'Data berhasil di simpan');
    }
}
