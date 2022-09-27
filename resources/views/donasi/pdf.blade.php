<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Cetak PDF</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    </head>
    <body>
        <style>
            table tr th,
            table tr,td{
                font-size: 9px;
            }
        </style>
        <div class="row">
            <h3><center>Rekapitulasi Keuangan Bulan {{ date('F',strtotime($bulan_id)) }}</center></h3><br>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Bulan</th>
                        <th>Pemasukan</th>
                        <th>Pengeluaran</th>
                        <th>Diskripsi</th>
                        <th>Saldo</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($show as $i =>$data)
                        <tr>
                            <td>{{ ++$i }}</td>
                            <td>{{ date('d F Y H:i:s',strtotime($data->tanggal)) }}</td>
                            @if($data->pemasukan == 0)
                            <td>-</td>
                            @else
                            <td>Rp. {{ number_format($data->pemasukan) }}</td>
                            @endif
                            @if($data->pengeluaran == 0)
                            <td>-</td>
                            @else
                            <td>Rp. {{ number_format($data->pengeluaran) }}</td>
                            @endif
                            <td>{{ $data->deskripsi }}</td>
                            <td>Rp. {{ number_format($data->saldo) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </body>
</html>
