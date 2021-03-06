(function() {
  window.plot = function(points, title) {
    var window_size = 10;
    var last_y = 0;
    var max_y = 1;

    var data = []
    var rolling_window = [];

    for (var i in points) {
      var point = points[i];

      /* Points are raw counts, compute deltas. */
      delta_y = point.y - last_y;
      last_y = point.y;
      rolling_window.push(delta_y);

      /* Keep 'rolling window' array trimmed. */
      if (rolling_window.length > window_size) {
        rolling_window.shift();
      }

      var total = 0;
      rolling_window.map(function(val) { total += val });
      var average = total / rolling_window.length;

      data.push({ 
        x: point.x,
        y: average
      });

      max_y = Math.max(max_y, average);
    } /* compute delta and rolling average */

    /* Sizing and scales. */
    var w = 600,
        h = 200,
        x = pv.Scale.linear(data, function(d) { return d.x }).range(0, w),
        y = pv.Scale.linear(0, max_y).range(0, h);

    /* The root panel. */
    var vis = new pv.Panel()
        .width(w)
        .height(h)
        .bottom(80)
        .left(80)
        .right(10)
        .top(5);

    /* Y-axis and ticks. */
    vis.add(pv.Rule)
        .data(y.ticks(5))
        .bottom(y)
        .strokeStyle(function(d) { return d ? "#eee" : "#000" })
      .anchor("left").add(pv.Label)
        .text(y.tickFormat)

    /* X-axis and ticks. */
    vis.add(pv.Rule)
        .data(x.ticks())
        .visible(function(d) { return d })
        .left(x)
        .bottom(-5)
        .height(5)
      .anchor("bottom").add(pv.Label)
        .text(x.tickFormat);

    /* The area with top line. */
    vis.add(pv.Area)
        .data(data)
        .bottom(1)
        .left(function(d) { return x(d.x) })
        .height(function(d) { return y(d.y) })
        .fillStyle("rgb(121,173,210)")
      .anchor("top").add(pv.Line)
        .lineWidth(3);

    vis.add(pv.Label)
        .bottom(50)
        .left(150)
        .font("16pt sans-serif")
        .text(title)

    vis.add(pv.Label)
        .left(-50)
        .top(150)
        .font("12pt sans")
        .text("events/sec")
        .textAngle(-Math.PI / 2);

    vis.add(pv.Label)
        .font("12pt sans")
        .bottom(-40)
        .left(250)
        .text("duration (seconds)")

    //vis.add(pv.Label)

    //vis.anchor("right").add(pv.Label)
        //.text("testing")

    vis.render();
  }
})();
