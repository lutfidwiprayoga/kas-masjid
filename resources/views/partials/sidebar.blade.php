<!-- LEFT SIDEBAR -->
<div id="sidebar-nav" class="sidebar">
    <div class="sidebar-scroll">
        <nav>
            <ul class="nav">
                @guest
                    <li><a href="/dashboard" class="{{ request()->is('dashboard*') ? 'active' : '' }}"><i
                                class="lnr lnr-home"></i> <span>Dashboard</span></a></li>
                    <li><a href="/recapitulation" class="{{ request()->is('recapitulation*') ? 'active' : '' }}"><i
                                class="lnr lnr-chart-bars"></i> <span>Rekapitulasi</span></a></li>
                    <li><a href="/info" class="{{ request()->is('info*') ? 'active' : '' }}"><i class="lnr lnr-user"></i>
                            <span>Info</span></a></li>
                @else
                    @if (Auth::user()->role == 'admin')
                        <li><a href="/dashboard" class="{{ request()->is('dashboard*') ? 'active' : '' }}"><i
                                    class="lnr lnr-home"></i> <span>Dashboard</span></a></li>
                        <li>
                            <a href="#subPages" data-toggle="collapse" class="collapsed"><i class="lnr lnr-book"></i>
                                <span>Keuangan</span> <i class="icon-submenu lnr lnr-chevron-left"></i></a>
                            <div id="subPages" class="collapse">
                                <ul class="nav active">
                                    <li><a href="/pemasukan"
                                            class="{{ request()->is('pemasukan*') ? 'active' : '' }}">Pemasukan</a></li>
                                    <li><a href="/pemasukanvalidasi"
                                            class="{{ request()->is('pemasukanvalidasi*') ? 'active' : '' }}">Donasi Masuk</a></li>
                                    <li><a href="/pengeluaran"
                                            class="{{ request()->is('pengeluaran*') ? 'active' : '' }}">Pengeluaran</a></li>
                                </ul>
                            </div>
                        </li>
                        <li><a href="/recapitulation" class="{{ request()->is('recapitulation*') ? 'active' : '' }}"><i
                                    class="lnr lnr-chart-bars"></i> <span>Rekapitulasi</span></a></li>
                    @elseif(Auth::user()->role == 'donatur')
                        <li><a href="/dashboard" class="{{ request()->is('dashboard*') ? 'active' : '' }}"><i
                                    class="lnr lnr-home"></i> <span>Dashboard</span></a></li>
                        <li><a href="/recapitulation" class="{{ request()->is('recapitulation*') ? 'active' : '' }}"><i
                                    class="lnr lnr-chart-bars"></i> <span>Rekapitulasi</span></a></li>
                        <li><a href="/donasi" class="{{ request()->is('donasi*') ? 'active' : '' }}"><i
                                    class="lnr lnr-gift"></i> <span>Donasi</span></a></li>
                        <li><a href="/info" class="{{ request()->is('info*') ? 'active' : '' }}"><i
                                    class="lnr lnr-user"></i> <span>Info</span></a></li>
                    @endif
                @endguest
            </ul>
        </nav>
    </div>
</div>
<!-- END LEFT SIDEBAR -->
