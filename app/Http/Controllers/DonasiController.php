<?php

namespace App\Http\Controllers;

use App\Models\Donasi;
use App\Models\Keuangan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use RealRashid\SweetAlert\Facades\Alert;
use Illuminate\Support\Facades\DB;

class DonasiController extends Controller
{
    public function index()
    {

        $now = Carbon::now();
        $item = Donasi::where('user_id', Auth::user()->id)->get();
        return view('donasi.index', compact('now', 'item'), [
            'title' => 'Donasi'
        ]);
    }

    public function store(Request $request)
    {

        $donasi = Donasi::create([
            'user_id' => Auth::user()->id,
            'nama' => $request->nama,
            'jenis_rek' => $request->jenis_rek,
            'jumlah' => $request->jumlah,
            'tanggal' => $request->tanggal,
            'status' => 'Diverifikasi',
        ]);
        if ($request->hasFile('foto')) {
            $request->file('foto')->move('foto/', $request->file('foto')->getClientOriginalName());
            $donasi->foto = $request->file('foto')->getClientOriginalName();
            $donasi->save();
        }

        $pemasukan = Keuangan::get();
        $uang = new Keuangan();
        $uang->user_id = Auth::user()->id;
        $uang->donasi_id = $donasi->id;
        $uang->tanggal = $donasi->tanggal;
        $uang->pemasukan = $donasi->jumlah;
        $uang->deskripsi = 'Bantuan Donasi';
        $uang->status = 'pemasukan';
        $uang->foto = $donasi->foto;
        foreach ($pemasukan as $item) {
            $uang->saldo = $item->saldo + $donasi->jumlah;
        }
        $uang->save();
        Alert::success('Success Add Data');
        return redirect('/donasi')->with('succes', 'Data berhasil di simpan');
    }

    public function terima(Request $request, $id)
    {
        $donasi = Donasi::find($id);
        $keuangan = Keuangan::where('donasi_id', $donasi->id)->first();
        $donasi->status = 'Diterima';
        $donasi->save();
        Alert::success('Success Acceptmen Donation');
        return redirect()->back();
    }
    public function tolak(Request $request, $id)
    {
        $donasi = Donasi::find($id);
        $keuangan = Keuangan::where('donasi_id', $donasi->id)->first();
        $donasi->status = 'Ditolak';
        $donasi->save();
        Alert::warning('Success Decline Donation');
        return redirect()->back();
    }

    public function update(Request $request, $id)
    {

        $pemasukan = Keuangan::find($id);
        $data = Donasi::find($id);
        $data->nama = $request->nama;
        $data->jenis_rek = $request->jenis_rek;
        $data->jumlah = $request->jumlah;
        $data->tanggal = $request->tanggal;
        $data->save();
        Alert::success('Success Updating Data');
        return redirect('/donasi');
    }

    public function destroy($id)
    {

        $donasi = Donasi::find($id);
        $keuangan = Keuangan::where('donasi_id', $donasi->id)->first();
        $keuangan->delete();
        $donasi->delete();
        Alert::success('Success Delete Data');
        return redirect('/donasi')->with('succes', 'Data berhasil di hapus');
    }
}
