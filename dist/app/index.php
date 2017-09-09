<?php

$title = 'fake title';
$keyword = 'fake keywords';
$description = 'fake description';
$url = 'http://example.com/';

$test_hosts = array("local.savorks.com");
if(!in_array($_SERVER['HTTP_HOST'], $test_hosts))
{
    @include "meta.php";
}
?>

<!DOCTYPE html>
<html>
<head lang="en">
    <title><?=$title?></title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">

    <meta property="og:title" content="<?=$title?>" />
    <meta property="og:keyword" content="<?=$keyword?>" />
    <meta property="og:type" content="activity" />
    <meta property="og:url" content="<?=$url?>" />
    <meta property="og:description" content="<?=$description?>" />

    <link rel="stylesheet" href="styles/main.1bb0fda53cf02cebb4b4.css">

</head>
<body onload="Main.init();">

    <!--<div id="main-layout"></div>-->

    <div id="invisible-container"></div>

    <div id="scene-container">
    <!--<div id="scene-container" class="fading">-->

        <div id="inner-page" class="hide-mode">

            <div class="inner-page-head">

                <div class="title">Latest News</div>
                <div class="leftline"></div>

            </div>

            <div class="loading-icon hide-mode"></div>

            <div class="content">

                <div id="initiatives-inner-page" class="inner-page-content-container">

                    <div class="btn-back"><div class="arrow"></div></div>
                    <div class="spacer"></div>

                </div>

                <div id="news-inner-page" class="inner-page-content-container">

                    <div class="btn-back"><div class="arrow"></div></div>
                    <div class="spacer"></div>

                </div>

                <div id="publication-inner-page" class="inner-page-content-container">

                    <div class="table-container">


                        <table class="content-table type-Monitor">

                            <tr>
                                <th class="col-date">Year</th>
                                <th class="col-name">Name</th>
                                <th class="col-thumb"></th>
                                <th class="col-description">Description</th>
                                <th class="col-download">Download</th>
                                <th class="col-select">Select</th>
                            </tr>

                            <tr class="sample">
                                <td class="col-date">2017</td>
                                <td class="col-name">APEC SME Monitor Issue 21</td>
                                <td class="col-thumb"><div class="thumb"></div></td>
                                <td class="col-description">This journal is intended to help  small and medium-sized enterprises catching the latest international business development, expert perspective on SME-related issues, and SME-related policies implemented in every APEC member economy</td>

                                <td class="col-download">
                                    <div class="icon"></div>
                                    <div class="filesize">1.5mb</div>
                                </td>

                                <td class="col-select">



                                    <div class="checkbox custom-checkbox">
                                        <input type="checkbox" id="upload-checkbox" class="upload-checkbox" />
                                        <label for="upload-checkbox"></label>
                                    </div>

                                </td>
                            </tr>

                        </table>

                        <div class="type-tabs">

                            <div class="tab tab-Monitor active-mode" anchor="Monitor">Monitor</div>
                            <div class="tab tab-Collections" anchor="Collections">APEC-Collections</div>
                            <div class="tab tab-Journals" anchor="Journals">Journals</div>

                        </div>

                        <div class="page-selector">

                            <div class="arrow-more-prev"></div>
                            <div class="arrow-prev"></div>
                            <div class="arrow-next"></div>
                            <div class="arrow-more-next"></div>

                            <div class="num-pages text">999</div>
                            <div class="text">Total: </div>
                            <input title="" class="page-input" maxlength="3">
                            <div class="text">Page: </div>

                        </div>


                    </div>

                    <div class="btn-back"><div class="arrow"></div></div>
                    <div class="btn-download"></div>

                    <div class="spacer"></div>

                </div>

                <div id="pictures-inner-page" class="inner-page-content-container">


                    <div class="album-detail">
                        <div class="date">2017/5/5 Fri</div>
                        <div class="title">2016 APEC Leaders' Declaration</div>
                        <div class="sub-title">We recognize that micro, small and medium-sized enterprises (MSMEs) are an essential component for economies to achieve quality growth and prosperity. As sources of innovation and employment</div>

                    </div>

                    <div class="item-container">

                        <div class="item">

                            <div class="thumb"></div>
                            <div class="title"></div>

                        </div>

                        <div class="spacer"></div>

                    </div>

                    <div class="btn-back"><div class="arrow"></div></div>
                    <div class="btn-download"><div class="arrow"></div></div>


                    <div class="spacer"></div>

                </div>

                <div id="download-inner-page" class="inner-page-content-container">

                    <div class="table-container">

                        <table class="content-table">

                            <tr>
                                <th class="col-title">Title</th>
                                <th class="col-date">Time</th>
                                <th class="col-download">Download</th>
                                <th class="col-select">Select</th>
                            </tr>

                            <tr class="sample">
                                <td class="col-title">2017</td>
                                <td class="col-date">2016/09/16</td>

                                <td class="col-download">
                                    <div class="icon"></div>
                                    <div class="filesize">1.5mb</div>
                                </td>

                                <td class="col-select">

                                    <div class="checkbox custom-checkbox">
                                        <input type="checkbox" id="download-checkbox" class="upload-checkbox" />
                                        <label for="download-checkbox"></label>
                                    </div>

                                </td>
                            </tr>

                        </table>
                        <div class="bottom-line"></div>

                        <div class="page-selector">

                            <div class="arrow-more-prev"></div>
                            <div class="arrow-prev"></div>
                            <div class="arrow-next"></div>
                            <div class="arrow-more-next"></div>

                            <div class="num-pages text">999</div>
                            <div class="text">Total: </div>
                            <input title="" class="page-input" maxlength="3">
                            <div class="text">Page: </div>

                        </div>


                    </div>

                    <div class="btn-back"><div class="arrow"></div></div>
                    <div class="btn-download"></div>

                    <div class="spacer"></div>

                </div>

            </div>

        </div>

        <div id="banner" class="section" anchor="/Home">
            <div class="content"></div>
        </div>

        <div id="news" class="section" anchor="/News">

            <div class="section-head">

                <div class="title">Latest News</div>
                <div class="underline"></div>
                <div class="sub-title">Viet Nam has opened its frist meeting of  offficials from the 21 APEC member economies</div>

            </div>

            <div class="content">

                <div class="item-container">

                    <!-- check -->

                    <div class="item">
                        <div class="thumb"></div>
                        <div class="date">2017/3/10</div>
                        <div class="title">2016 APEC Leaders' Declaration</div>
                        <div class="sub-title">Aiming to unleash the potential of SMEs to boost Asia-Pacific economic growth</div>
                    </div>

                </div>

                <div class="page-dot-container">
                    <!--<div class="dot"></div>-->
                </div>

                <div class="arrow-prev hide-mode"></div>
                <div class="arrow-next hide-mode"></div>

            </div>

        </div>

        <div id="events" class="section" anchor="/Events">

            <div class="section-head">

                <div class="title">Events</div>
                <div class="underline"></div>
                <div class="sub-title">Viet Nam has opened its frist meeting of  offficials from the 21 APEC member economies</div>

            </div>

            <div class="content">

                <div class="item-container">

                    <div class="item">
                        <div class="thumb"></div>
                        <div class="date"></div>
                        <div class="title"></div>
                        <div class="sub-title"></div>
                    </div>

                </div>

                <div class="page-dot-container">
                </div>

                <div class="arrow-prev hide-mode"></div>
                <div class="arrow-next hide-mode"></div>

            </div>

        </div>

        <div id="publication" class="section" anchor="/Publication">

            <div class="section-head">

                <div class="title">Publication</div>
                <div class="underline"></div>
                <div class="sub-title">Viet Nam has opened its frist meeting of  offficials from the 21 APEC member economies</div>

            </div>

            <div class="content">

                <div class="item-container">

                    <div class="item">
                        <div class="thumb"></div>
                        <div class="date"></div>
                        <div class="title"></div>
                        <div class="sub-title"></div>
                    </div>

                </div>

                <div class="page-dot-container">
                </div>

                <div class="arrow-prev hide-mode"></div>
                <div class="arrow-next hide-mode"></div>

            </div>

        </div>

        <div id="pictures" class="section" anchor="/Pictures">

            <div class="section-head">

                <div class="title">Pictures</div>
                <div class="underline"></div>
                <div class="sub-title">Viet Nam has opened its frist meeting of  offficials from the 21 APEC member economies</div>

            </div>

            <div class="content">

                <div class="item-container">

                    <div class="item">
                        <div class="thumb"></div>
                        <div class="date"></div>
                        <div class="title"></div>
                        <div class="sub-title"></div>
                    </div>

                </div>

                <div class="page-dot-container">
                </div>

                <div class="arrow-prev hide-mode"></div>
                <div class="arrow-next hide-mode"></div>

            </div>

        </div>

        <div id="videos" class="section" anchor="/Videos">

            <div class="section-head">

                <div class="title">Videos</div>
                <div class="underline"></div>

            </div>

            <div class="content">

                <div class="item-container">

                    <div class="item">
                        <div class="thumb"></div>
                        <div class="title"></div>
                    </div>

                </div>

                <div class="page-dot-container">
                </div>

                <div class="arrow-prev hide-mode"></div>
                <div class="arrow-next hide-mode"></div>

            </div>

        </div>

        <div id="links">

            <div class="content">

                <div class="desc">Links</div>

                <div class="item-container">

                    <div class="item-wrapper">

                        <div class="item">
                            <div class="thumb"></div>
                            <div class="title"></div>
                        </div>
                    </div>

                </div>


                <div class="deco-left"></div>
                <div class="deco-right"></div>

                <div class="arrow-prev hide-mode"></div>
                <div class="arrow-next hide-mode"></div>

            </div>

        </div>

        <div id="footer">

            <div class="top"></div>
            <div class="middle">




                    <div class="bottom-line"></div>
                    <div class="logo"></div>
                    <div class="detail">
                        <div>contact us</div>
                        <div>TEL: +88602-2586-5000 ext. 562</div>
                        <div>Email: <a href="mailto:d33283@tier.org.tw" target="_blank" >d33283@tier.org.tw</a></div>
                    </div>

                    <div class="fb-page-sample">
                        <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FAPECSMEMonitor%2F&tabs=timeline&width=239&height=322&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=" width="239" height="322" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>

                    </div>

                    <div class="copy-right">Copyright 2017 APEC SME Monitor. All Rights Reserved</div>


            </div>
            <div class="bottom"></div>

        </div>

    </div>

    <div id="header">



        <div class="drop-menu">

        </div>

        <div class="top-part">
            <div class="logo"></div>
            <div class="title"></div>

            <div class="triangle"></div>
            <div class="text-follow-us"></div>

            <a href="https://www.facebook.com/APECSMEMonitor/" target="_blank" class="btn fb-icon"></a>
            <a href="https://www.youtube.com/channel/UC7GuRDWlFe64RkMWDBATJqQ" target="_blank" class="btn youtube-icon"></a>
            <a href="mailto:d33283@tier.org.tw,d32491@tier.org.tw,d32438@tier.org.tw" target="_blank" class="btn email-icon"></a>

        </div>


        <div class="menu-part">

            <div class="button-container">

                <div class="menu-button" anchor="/Home">Home</div>
                <div class="deco"></div>
                <div class="menu-button" anchor="/Initiatives">Initiatives</div>
                <div class="deco"></div>
                <div class="menu-button" anchor="/News">News Release</div>
                <div class="deco"></div>
                <div class="menu-button" anchor="/Events">Events</div>
                <div class="deco"></div>
                <div class="menu-button" anchor="/Publication">Publications</div>
                <div class="deco"></div>
                <div class="menu-button" anchor="/Pictures">Pictures</div>
                <div class="deco"></div>
                <div class="menu-button" anchor="/Videos">Videos</div>
                <div class="deco"></div>
                <div class="menu-button" anchor="/Download">Download</div>
                <!--<div class="menu-button" anchor="/Download">Download</div>-->


            </div>

            <div class="baseline"></div>

        </div>

    </div>

    <div id="fb-root"></div>


    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="js/lib/jquery.1.11.3.min.js"><\/script>')</script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
    <script>window.TweenMax || document.write('<script src="js/lib/TweenMax.min.js"><\/script>')</script>

    <script>
        if(window.location.host == 'local.savorks.com' || window.location.host == 'apac.jktarots.com:9454')
        {
            document.write('<script src="js/FAKE_DATA.js"><\/script>');
        }
    </script>

    <script src="js/optimized.e77627de3b8761144af1.js"></script>

</body>
</html>