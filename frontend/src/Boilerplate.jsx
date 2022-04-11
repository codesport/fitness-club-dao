import React from "react";

function Boilerplate(){

    return(
        <React.Fragment>
            <div className="top-header">
                <div className="container">
                    <div className="row">

                        <div className="col-sm-4 col-xs-8 tree-name">
                            <a href="http://localhost:3001" ><span className="tree-bars">Fitness</span> ventures</a>			
                        </div>

                        <div className="col-sm-8 col-xs-4">
                            <nav className="header-navigation">
                            <ul id="menu-illdy-main" className="clearfix"><li id=""><a href="http://localhost:3001/calendar.html">Event Calendar</a></li>
                                <li id=""><a href="/login">About Us</a></li>
                                <li id=""><a href="/login">Gyms</a></li>
                                <li id=""><a href="/login">Competitions</a></li>
                                <li id="" className="menu-item-has-children"><a href="/login">Our Team</a>
                                    <ul className="sub-menu">
                                        <li id="menu-item-71" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-71"><a href="/login">Blog</a></li>
                                    </ul>
                                </li>
                                <li id=""><a href="/login">Contact US</a></li>
                            </ul>
                            </nav>

                            <button className="open-responsive-menu"><i className="fa fa-bars"></i></button>

                        </div>
                    </div>
                </div>
            </div>
        
        </React.Fragment>

    )


}

//Named Exports
export { Boilerplate }
