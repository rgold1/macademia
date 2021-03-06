
var LabeledSphere = Sphere.extend({
    VERTICAL_LABEL_SPACING : 0,

    init : function(params) {
        var x = params.x, y = params.y;

        // FIXME: some of these are also intialized in Sphere
        this.name = params.name;
        this.interest = params.interest;
        this.id = params.id || this.interest.id;
        this.scale = params.scale || 1.0;
        this.paper = params.paper;
        this.xOffset = params.xOffset;
        this.yOffset = params.yOffset;
        this.font = params.font || macademia.nbrviz.mainFont;
        this.boldFont = params.boldFont || macademia.nbrviz.mainFontBold;
        this.labelBgOpacity = params.labelBgOpacity || 0.8;
        this.clickText = params.clickText || '(click to add)';

        this.label = this.paper.text(
                x + this.scale * this.xOffset,
                y + this.scale * this.yOffset, macademia.trimSpace(this.name))
                    .attr({fill: '#000', 'font': this.font});
        var bbox1 = this.label.getBBox();
        this.labelWidth = bbox1.width;
        this.labelHeight = bbox1.height;

        this.addLink = this.paper.text(
                x + this.scale * this.xOffset,
                y + this.scale * this.yOffset + bbox1.height + this.VERTICAL_LABEL_SPACING,
                this.clickText);
        this.addLink.attr({
            'font': this.font,
            'text-decoration' : 'underline',
            'cursor' : 'pointer'
        });

        // x and y relative to center
        this.addLinkXOffset = this.scale * this.xOffset;
        this.addLinkYOffset = this.scale * this.yOffset + bbox1.height + this.VERTICAL_LABEL_SPACING;
        var w = bbox1.width;
        var h = (bbox1.height*2 + this.VERTICAL_LABEL_SPACING) * 1.2;
        this.addLink.hide();

        this.labelBg = this.paper.rect(
                x + this.scale * (this.xOffset - w / 2),
                y + this.scale * (this.yOffset - h / 2),
                this.scale * w,
                this.scale * h);
        this.labelBg.attr({ 'fill' : '#fff',
            'fill-opacity' : this.labelBgOpacity,
            'stroke' : '#fff',
            'stroke-width' : 0.0});
        this.labelBg.hide();
        this.label.toFront();
        this.type = 'interest';

        this._super(params);
    },

    cloneParams : function() {
        return $.extend(this._super(), {
            xOffset : this.xOffset,
            yOffset : this.yOffset,
            font : this.font,
            name : this.name,
            scale : this.scale,
            interest : this.interest,
            id : this.id,
            clickText : this.clickText
        });
    },

    setHighlightMode : function(mode) {
        var lastMode = this.highlightMode;
        if (mode == lastMode) {
            return;
        }
        var attrs = {};

        // change from highlight to normal and vice-versa
        if (mode == this.HIGHLIGHT_ON) {
            this.labelBg.show();
            this.labelBg.insertBefore(this.label);
            attrs['font'] = this.boldFont;
            attrs['font-weight'] = 'bold';
            this.addLink.attr({
                x : (this.getX() + this.addLinkXOffset),
                y : (this.getY() + this.addLinkYOffset)
            });
            this.addLink.show();
            this.addLink.toFront();
        } else if (lastMode == this.HIGHLIGHT_ON) {
            this.labelBg.hide();
            attrs['font'] = this.font;
            attrs['font-weight'] = 'normal';
            this.addLink.hide();
        }

        // set font color
        if (mode == this.HIGHLIGHT_ON) {
            attrs['fill'] = '#000';
        } else if (mode == this.HIGHLIGHT_NONE) {
            attrs['fill'] = '#444';
        } else if (mode == this.HIGHLIGHT_OFF) {
            attrs['fill'] = '#666';
        }
        this.label.attr(attrs);
        this.addLink.attr(attrs);

        this._super(mode);
    },

    showText : function() {
        if (this.labelBg) { this.label.show(); }
    },

    hideText : function() {
        if (this.labelBg) { this.label.hide(); }
    },
    getRects : function() {
        return this._super().concat([this.labelBg, this.label]);
    },
    show : function() {
        var self = this;
        $.each(this.getLayers(), function(i, l) {
            if (l != self.addLink) {
                l.show();
            }
        });
    },
    getLayers : function() {
        var sphereLayers = this._super();
        var layers = [];
        layers.push(sphereLayers[0]);   // handle
        macademia.concatInPlace(layers, sphereLayers.slice(1));
        layers.push(this.label);
        layers.push(this.addLink);
        layers.push(this.labelBg);
        return layers;
    },
    animate : function(attrs, millis, arg1, arg2) {
        this._super(attrs, millis, arg1, arg2);
        var self = this;
        // handle rectangles (position is upper left)
        $.each([this.label, this.labelBg], function(i) {
            var a = $.extend({}, attrs);
            if (a.fill) { delete a.fill; }
            a.x = a.x || self.getX();
            a.y = a.y || self.getY();
            a.scale = a.scale || self.scale;
            if (a.x) {
                a.x += a.scale * (self.xOffset - this.attr('width') / 2);
                a.y += a.scale * (self.yOffset - this.attr('height') / 2);
                if (this === self.labelBg) {
                    a.y += this.attr('height') * 0.25 * a.scale;
                }
            }
            this.animateOrAttr(a, millis, arg1, null);
        });
    },
    setPosition : function(x, y) {
        this._super(x, y);
        var self = this;
        // handle rectangles (position is upper left)
        $.each([this.label, this.labelBg], function() {
            var rx = x + self.scale * (self.xOffset - this.attr('width') / 2);
            var ry = y + self.scale * (self.yOffset - this.attr('height') / 2);
            if (this === self.labelBg) {
                ry += this.attr('height') * 0.25 * self.scale;
            }
            this.attr({'x' : rx, 'y' : ry});
        });
    },
    clicked : function(callback) {
        var self = this;
        $.each(this.getLayers(),
                function (i, l) {
                    l.click(function() { callback(self.interest, self); });
                }
        );
    },
    getBackgroundLayer : function() {
        return this.labelBg;
    }
});