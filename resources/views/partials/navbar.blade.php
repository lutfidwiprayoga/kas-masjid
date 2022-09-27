<!-- NAVBAR -->
<nav class="navbar navbar-default navbar-fixed-top">
    <div class="brand">
        <a href="/" style="color: black"><strong>Masjid Subulussalam</strong></a>
    </div>
    <div class="container-fluid">
        <div class="navbar-btn">
            <button type="button" class="btn-toggle-fullwidth"><i class="lnr lnr-arrow-left-circle"></i></button>
        </div>
        <form class="navbar-form navbar-left">
            <div class="input-group">
                <input type="text" value="" class="form-control" placeholder="Search...">
                <span class="input-group-btn"><button type="button" class="btn btn-primary">Go</button></span>
            </div>
        </form>

        <div id="navbar-menu">
            <ul class="nav navbar-nav navbar-right">
                @guest
                <li class="dropdown">
                    <div class="navbar-btn navbar-btn-right">
                        <a class="btn btn-primary update-pro" href="{{ route('login') }}">
                        <span>Log In</span></a>
                    </div>
                </li>
                        @else
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown"><img src="{{ url('profile/' . auth()->user()->foto) }}" class="img-circle" alt="Avatar"> <span>{{ auth()->user()->name }}</span> <i class="icon-submenu lnr lnr-chevron-down"></i></a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a href="/getProfile"><i class="lnr lnr-user"></i>
                                            <span>My Profile</span>
                                        </a>
                                    </li>
                                    <li>
                                        <form action="/logout" method="post">
                                        @csrf
                                            <button type="submit"  class="btn btn-default" style="border: none">
                                                <i class="lnr lnr-exit"></i>
                                                <span>Logout</span>
                                            </button>
                                        </form>
                                    </li>
                                </ul>
                        </li>
                    @endguest
                <!-- <li>
                    <a class="update-pro" href="https://www.themeineed.com/downloads/klorofil-pro-bootstrap-admin-dashboard-template/?utm_source=klorofil&utm_medium=template&utm_campaign=KlorofilPro" title="Upgrade to Pro" target="_blank"><i class="fa fa-rocket"></i> <span>UPGRADE TO PRO</span></a>
                </li> -->
            </ul>
        </div>
    </div>
</nav>

