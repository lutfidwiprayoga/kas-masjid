<?php

use App\Http\Controllers\ArtikelController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DonasiController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\InfoController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PDFController;
use App\Http\Controllers\PemasukanController;
use App\Http\Controllers\PemasukanDiterimaController;
use App\Http\Controllers\PengeluaranController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecapitulationController;
use App\Http\Controllers\RegisterController;
use App\Models\Artikel;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('home');

    Route::get('/page', [PageController::class, 'index']);
});
//login
Route::get('/login', [LoginController::class, 'index'])->name('login');
Route::post('/login', [LoginController::class, 'authenticate'])->name('login.post');
Route::post('/logout', [LoginController::class, 'logout']);

//Register
Route::get('/register', [RegisterController::class, 'index']);
Route::post('/register', [RegisterController::class, 'store']);
Route::post('/register/update', [RegisterController::class, 'update'])->name('register.update');

// dashboard
Route::get('/dashboard', [DashboardController::class, 'index']);

//pemasukan
Route::get('/pemasukan', [PemasukanController::class, 'index'])->middleware('auth');
Route::get('/pemasukanvalidasi', [PemasukanDiterimaController::class, 'index'])->middleware('auth')->name('pemasukan.validasi');
Route::post('/pemasukan/post', [PemasukanController::class, 'store'])->name('pemasukan.post');
Route::delete('/pemasukan/delete/{id}', [PemasukanController::class, 'destroy'])->name('pemasukan.destroy');

//pengeluaran
Route::get('/pengeluaran', [PengeluaranController::class, 'index'])->middleware('auth');
Route::post('/pengeluaran', [PengeluaranController::class, 'store'])->name('pengeluaran.post');
Route::post('/pengeluaran/{id}', [PengeluaranController::class, 'update'])->name('pengeluaran.update');
Route::delete('/pengeluaran/delete/{id}', [PengeluaranController::class, 'destroy'])->name('pengeluaran.delete');

//rekapitulasi
Route::get('/recapitulation', [RecapitulationController::class, 'index'])->name('rekap.index');
Route::get('/recapitulation/bulan', [RecapitulationController::class, 'cariBulan'])->name('rekap.bulan');

//donasi
Route::get('/donasi', [DonasiController::class, 'index'])->middleware('auth');
Route::post('/donasi', [DonasiController::class, 'store'])->name('donasi.post');
Route::post('/donasi/{id}', [DonasiController::class, 'update'])->name('donasi.update');
Route::post('/donasi/terima/{id}', [DonasiController::class, 'terima'])->name('donasi.terima');
Route::post('/donasi/tolak/{id}', [DonasiController::class, 'tolak'])->name('donasi.tolak');
Route::delete('/donasi/delete/{id}', [DonasiController::class, 'destroy'])->name('donasi.delete');

//pdf
Route::get('/cetakpdf', [PDFController::class, 'cetakPDF'])->name('cetakpdf');

//info
Route::get('/info', [InfoController::class, 'index']);

//artikel
Route::get('/artikel', [ArtikelController::class, 'index'])->middleware('auth');
Route::post('/artikel', [ArtikelController::class, 'store'])->name('artikel.post');
Route::post('/artile/{id}', [ArtikelController::class, 'update'])->name('artikel.update');
Route::delete('/artikel/delete/{id}', [ArtikelController::class, 'destroy'])->name('artikel.delete');

//profile
Route::get('/getProfile', [ProfileController::class, 'index'])->middleware('auth');
