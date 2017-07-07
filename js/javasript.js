$(function () {
  var localip;

  function getIPs(callback) {
    var ip_dups = {};

    var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;

    if (!RTCPeerConnection) {

      var win = iframe.contentWindow;
      RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
      useWebKit = !!win.webkitRTCPeerConnection;
    }

    var mediaConstraints = {
      optional: [{ RtpDataChannels: true }]
    };

    var servers = { iceServers: [{ urls: "stun:stun.services.mozilla.com" }] };

    var pc = new RTCPeerConnection(servers, mediaConstraints);

    function handleCandidate(candidate) {
      var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
      var ip_addr = ip_regex.exec(candidate)[1];

      if (ip_dups[ip_addr] === undefined)
        callback(ip_addr);

      ip_dups[ip_addr] = true;
    }

    pc.onicecandidate = function (ice) {

      if (ice.candidate)
        handleCandidate(ice.candidate.candidate);
    };

    pc.createDataChannel("");

    pc.createOffer(function (result) {

      pc.setLocalDescription(result, function () {}, function () {});

    }, function () {});

    setTimeout(function () {
      var lines = pc.localDescription.sdp.split('\n');

      lines.forEach(function (line) {
        if (line.indexOf('a=candidate:') === 0)
          handleCandidate(line);
      });
    }, 1000);
  }
  getIPs(function (ip) {
    localip = ip;
  });
  $("#send").click(function () {
    var msgbox = $("#textmsg").val();
    ref.push({
      comment: msgbox.split("\n").join("<br/>"),
      ip: localip
    });
    $("#textmsg").val("");
  });
  ref.on("child_added", function (data) {
    if (data.val().url) {
      $(".chatDiv ul").append("<li><img class='myImg' src='" + data.val().url + "'/></li>");
      var modal = $("#myModal");
      var img = $(".myImg");
      var modalImg = $("#img01");
      img.click(function () {
        var store = $(this).attr("src");
        modal.css("display", "block");
        modalImg.attr("src", store);
      });
      var span = document.getElementsByClassName("close")[0];
      span.click(function () {
        modal.css("display", "none");
      });
    } else {
      $(".chatDiv ul").append("<li><b>anonymous:</b> " + data.val().comment + "</li>");
    }

    $(".chatDiv").scrollTop($(".chatDiv")[0].scrollHeight);
  });

});
