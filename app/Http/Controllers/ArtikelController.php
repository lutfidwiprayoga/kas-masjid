<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use Illuminate\Http\Request;
use RealRashid\SweetAlert\Facades\Alert;
use Illuminate\Support\Facades\Auth;

class ArtikelController extends Controller
{
    public function index(){

        $data = Artikel::all();
        return view('artikel.index', compact('data'), [
            'title' => 'Artikel'
        ]);
    }

    public function store(Request $request){

        $artikel = Artikel::create([
            'user_id' => Auth::user()->id,
            'title' => $request->title,
            'deskripsi' => $request->deskripsi,
        ]);
        if($request->hasFile('foto')){
            $request->file('foto')->move('foto/',$request->file('foto')->getClientOriginalName());
            $artikel->foto = $request->file('foto')->getClientOriginalName();
            $artikel->save();
        }
        Alert::success('Success Add Data');
        return redirect('/artikel')->with('succes', 'Data berhasil di simpan');
    }

    public function update(Request $request, $id){

        $data = Artikel::find($id);
        $data->title = $request->title;
        $data->deskripsi = $request->deskripsi;
        $data->save();
        Alert::success('Success Updating Data');
        return redirect('/artikel');
    }

    public function destroy($id){

        $data = Artikel::find($id);
        $data->delete();
        Alert::success('Success Delete Data');
        return redirect('/artikel');
    }
}
