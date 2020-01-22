const WATER_COLOR = '#03A9F4';
const WATER_TABLE_COLOR = '#01579B';

export default {
  name: 'SaturationLayer',
  props: {
    scale: {
      type: Number,
      default: 14,
    },
    size: {
      type: Array,
      default() {
        return [10, 10];
      },
    },
    saturation: {
      type: Uint8Array,
      default: null,
    },
    opacity: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    scale() {
      this.draw();
    },
    size() {
      this.draw();
    },
    saturation() {
      this.draw();
    },
  },
  methods: {
    draw() {
      const [width, height] = this.size;
      const ctx = this.$el.getContext('2d');

      if (!this.saturation) {
        ctx.clearRect(0, 0, width * this.scale, height * this.scale);
        return;
      }

      ctx.fillStyle = WATER_COLOR;
      ctx.fillRect(0, 0, width * this.scale, height * this.scale);

      // Extract canvas to apply water saturation
      const bgImage = ctx.getImageData(
        0,
        0,
        width * this.scale,
        height * this.scale
      );

      for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
          const alpha = this.saturation[i + j * width];
          const offset =
            4 * (i * this.scale + j * this.scale * width * this.scale);
          for (let dy = 0; dy < this.scale; dy++) {
            for (let dx = 0; dx < this.scale; dx++) {
              const dOffset = 4 * (dx + dy * width * this.scale);
              bgImage.data[offset + dOffset + 3] = alpha;
            }
          }
        }
      }
      ctx.putImageData(bgImage, 0, 0);

      // Extract water table
      const table = new Float32Array(width);
      table.fill(0);
      for (let i = 0; i < width; i++) {
        for (let j = height; j > 0; j--) {
          if (this.saturation[i + j * width] === 255) {
            table[i] = j;
            i++;
            j = height;
          }
        }
      }
      ctx.lineWidth = Math.round(this.scale / 5);
      ctx.strokeStyle = WATER_TABLE_COLOR;
      ctx.beginPath();
      ctx.moveTo(0, table[0] * this.scale);
      for (let i = 0; i < width; i++) {
        ctx.lineTo((i + 0.5) * this.scale, table[i] * this.scale);
      }
      ctx.lineTo(width * this.scale, table[table.length - 1] * this.scale);
      ctx.stroke();
    },
  },
  mounted() {
    this.draw();
  },
};
