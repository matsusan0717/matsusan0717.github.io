(function() {

var SITE_URL = 'https://m-strux.matsusanjpn.com/';
var PAGE_SIZE = 12;

var themes = [
  {
    id: "amber", name: "Amber Classic", tag: "デフォルト",
    swatches: ["#800000", "#1e3a5f", "#e97834"],
    light: {
      "--bg-color": "#f8fafc", "--text-main": "#555555", "--text-muted": "#64748b",
      "--card-bg": "transparent", "--border": "#e2e8f0", "--accent": "#1e3a5f",
      "--accent-hover": "#e97834", "--base-navy": "#1e3a5f", "--sub-amber": "#f59e0b",
      "--bq-bg": "#f3f3f3", "--bq-border": "#c4c4c4",
      "--header-bg": "#800000",
      "--tab-text-active": "#333", "--tab-text-muted": "#aaaaaa",
      "--tab-lamp-color": "#333", "--tab-border-color": "#eeeeee",
    },
    dark: {
      "--bg-color": "#1a0a0a", "--text-main": "#f0eded", "--text-muted": "#b0a8a8",
      "--card-bg": "transparent", "--border": "#3a1a1a", "--accent": "#e97834",
      "--accent-hover": "#f59e0b", "--header-bg": "#5a0000",
      "--bq-bg": "#2a1010", "--bq-border": "#4a2020",
      "--tab-text-active": "#f0eded", "--tab-text-muted": "#6a4040",
      "--tab-lamp-color": "#e97834", "--tab-border-color": "#3a1a1a",
    },
  },
  {
    id: "deepblue", name: "Deep Blue", tag: "",
    swatches: ["#113246", "#1e4a6b", "#2d6a8a"],
    light: {
      "--bg-color": "#f0f7fa", "--text-main": "#113246", "--text-muted": "#1e4a6b",
      "--card-bg": "transparent", "--border": "#b8d4e3", "--accent": "#113246",
      "--accent-hover": "#1e4a6b", "--base-navy": "#113246", "--sub-amber": "#2d6a8a",
      "--bq-bg": "#e1f0f5", "--bq-border": "#8fc4dc",
      "--header-bg": "#113246",
      "--tab-text-active": "#113246", "--tab-text-muted": "#8fc4dc",
      "--tab-lamp-color": "#1e4a6b", "--tab-border-color": "#b8d4e3",
    },
    dark: {
      "--bg-color": "#0a1e2d", "--text-main": "#e1f0f5", "--text-muted": "#8fc4dc",
      "--card-bg": "transparent", "--border": "#113246", "--accent": "#2d6a8a",
      "--accent-hover": "#8fc4dc", "--header-bg": "#0a1e2d",
      "--bq-bg": "#113246", "--bq-border": "#1e4a6b",
      "--tab-text-active": "#e1f0f5", "--tab-text-muted": "#1e4a6b",
      "--tab-lamp-color": "#2d6a8a", "--tab-border-color": "#113246",
    },
  },
  {
    id: "darkgreen", name: "Dark Green", tag: "",
    swatches: ["#1B2017", "#2d3a2a", "#4a5a45"],
    light: {
      "--bg-color": "#f2f3f0", "--text-main": "#1B2017", "--text-muted": "#202118",
      "--card-bg": "transparent", "--border": "#c5c9c0", "--accent": "#1B2017",
      "--accent-hover": "#2d3a2a", "--base-navy": "#1B2017", "--sub-amber": "#4a5a45",
      "--bq-bg": "#e8eae4", "--bq-border": "#a8b0a0",
      "--header-bg": "#1B2017",
      "--tab-text-active": "#1B2017", "--tab-text-muted": "#a8b0a0",
      "--tab-lamp-color": "#2d3a2a", "--tab-border-color": "#c5c9c0",
    },
    dark: {
      "--bg-color": "#0f120d", "--text-main": "#F4F6F3", "--text-muted": "#F6F6F3",
      "--card-bg": "transparent", "--border": "#1B2017", "--accent": "#799272",
      "--accent-hover": "#a8b0a0", "--header-bg": "#0f120d",
      "--bq-bg": "#1B2017", "--bq-border": "#2d3a2a",
      "--tab-text-active": "#F4F6F3", "--tab-text-muted": "#2d3a2a",
      "--tab-lamp-color": "#799272", "--tab-border-color": "#1B2017",
    },
  },
  {
    id: "terracotta", name: "Deep Maroon", tag: "",
    swatches: ["#3B060A", "#7a1018", "#b83040"],
    light: {
      "--bg-color": "#fdf5f5", "--text-main": "#3B060A", "--text-muted": "#3C1D06",
      "--card-bg": "transparent", "--border": "#f0d0d0", "--accent": "#6B630B",
      "--accent-hover": "#7a1018", "--base-navy": "#3B060A", "--sub-amber": "#b83040",
      "--bq-bg": "#fae8e8", "--bq-border": "#e0b0b0",
      "--header-bg": "#3B060A",
      "--tab-text-active": "#3B060A", "--tab-text-muted": "#e0b0b0",
      "--tab-lamp-color": "#7a1018", "--tab-border-color": "#f0d0d0",
    },
    dark: {
      "--bg-color": "#150204", "--text-main": "#FAEBEC", "--text-muted": "#FAF1EB",
      "--card-bg": "transparent", "--border": "#3B060A", "--accent": "#D55D6B",
      "--accent-hover": "#d4a0a0", "--header-bg": "#150204",
      "--bq-bg": "#2a0508", "--bq-border": "#5a1015",
      "--tab-text-active": "#FAEBEC", "--tab-text-muted": "#5a1015",
      "--tab-lamp-color": "#D55D6B", "--tab-border-color": "#3B060A",
    },
  },
  {
    id: "olive", name: "Burnt Orange", tag: "",
    swatches: ["#E6501B", "#f07040", "#f59060"],
    light: {
      "--bg-color": "#fff8f5", "--text-main": "#3D1100", "--text-muted": "#3D3000",
      "--card-bg": "transparent", "--border": "#fad0b8", "--accent": "#8A2700",
      "--accent-hover": "#f07040", "--base-navy": "#8a2800", "--sub-amber": "#f59060",
      "--bq-bg": "#fde8d8", "--bq-border": "#f5b898",
      "--header-bg": "#8a2800",
      "--tab-text-active": "#8a2800", "--tab-text-muted": "#f5b898",
      "--tab-lamp-color": "#E6501B", "--tab-border-color": "#fad0b8",
    },
    dark: {
      "--bg-color": "#1a0d08", "--text-main": "#fde8d8", "--text-muted": "#FDFBD8",
      "--card-bg": "transparent", "--border": "#5a2010", "--accent": "#F09675",
      "--accent-hover": "#f07040", "--header-bg": "#1a0d08",
      "--bq-bg": "#2a1508", "--bq-border": "#7a3020",
      "--tab-text-active": "#fde8d8", "--tab-text-muted": "#5a2010",
      "--tab-lamp-color": "#F09675", "--tab-border-color": "#5a2010",
    },
  },
  {
    id: "indigo", name: "Midnight Blue", tag: "",
    swatches: ["#121358", "#2a2b9a", "#4a4bcc"],
    light: {
      "--bg-color": "#f3f3fc", "--text-main": "#010104", "--text-muted": "#040401",
      "--card-bg": "transparent", "--border": "#c8c8f0", "--accent": "#151556",
      "--accent-hover": "#2a2b9a", "--base-navy": "#121358", "--sub-amber": "#4a4bcc",
      "--bq-bg": "#e8e8fa", "--bq-border": "#a8a8e8",
      "--header-bg": "#121358",
      "--tab-text-active": "#121358", "--tab-text-muted": "#a8a8e8",
      "--tab-lamp-color": "#2a2b9a", "--tab-border-color": "#c8c8f0",
    },
    dark: {
      "--bg-color": "#08082a", "--text-main": "#e8e8fa", "--text-muted": "#EAF2FA",
      "--card-bg": "transparent", "--border": "#1e1e5a", "--accent": "#98BFE7",
      "--accent-hover": "#a8a8e8", "--header-bg": "#08082a",
      "--bq-bg": "#121358", "--bq-border": "#2a2b9a",
      "--tab-text-active": "#e8e8fa", "--tab-text-muted": "#2a2b9a",
      "--tab-lamp-color": "#98BFE7", "--tab-border-color": "#1e1e5a",
    },
  },
  {
    id: "coral", name: "Coral Red", tag: "",
    swatches: ["#C44545", "#d65a5a", "#e86f6f"],
    light: {
      "--bg-color": "#fff5f5", "--text-main": "#0D0C0C", "--text-muted": "#3E4242",
      "--card-bg": "transparent", "--border": "#ffd4d4", "--accent": "#636969",
      "--accent-hover": "#d65a5a", "--base-navy": "#433f3f", "--sub-amber": "#e86f6f",
      "--bq-bg": "#ffe8e8", "--bq-border": "#ffb8b8",
      "--header-bg": "#433f3f",
      "--tab-text-active": "#C44545", "--tab-text-muted": "#ffb8b8",
      "--tab-lamp-color": "#d65a5a", "--tab-border-color": "#ffd4d4",
    },
    dark: {
      "--bg-color": "#2e0f0f", "--text-main": "#ffe8e8", "--text-muted": "#FFF2E5",
      "--card-bg": "transparent", "--border": "#C48545", "--accent": "#E7AB6E",
      "--accent-hover": "#ffb8b8", "--header-bg": "#433f3f",
      "--bq-bg": "#C44545", "--bq-border": "#d65a5a",
      "--tab-text-active": "#ffe8e8", "--tab-text-muted": "#d65a5a",
      "--tab-lamp-color": "#E7AB6E", "--tab-border-color": "#C44545",
    },
  },
  {
    id: "peach", name: "Peach", tag: "",
    swatches: ["#FFC570", "#ffcf8a", "#ffd9a4"],
    light: {
      "--bg-color": "#fffbf2", "--text-main": "#170F07", "--text-muted": "#07170F",
      "--card-bg": "transparent", "--border": "#ffe8cc", "--accent": "#523619",
      "--accent-hover": "#ffcf8a", "--base-navy": "#8B5A2B", "--sub-amber": "#FFC570",
      "--bq-bg": "#fff5e6", "--bq-border": "#ffd699",
      "--header-bg": "#8B5A2B",
      "--tab-text-active": "#8B5A2B", "--tab-text-muted": "#a07040",
      "--tab-lamp-color": "#FFC570", "--tab-border-color": "#ffe8cc",
    },
    dark: {
      "--bg-color": "#1a1208", "--text-main": "#fff5e6", "--text-muted": "#FCFFE5",
      "--card-bg": "transparent", "--border": "#8B5A2B", "--accent": "#FFC570",
      "--accent-hover": "#ffd699", "--header-bg": "#1a1208",
      "--bq-bg": "#8B5A2B", "--bq-border": "#a07040",
      "--tab-text-active": "#fff5e6", "--tab-text-muted": "#a07040",
      "--tab-lamp-color": "#FFC570", "--tab-border-color": "#8B5A2B",
    },
  },
  {
    id: "salmon", name: "Salmon", tag: "",
    swatches: ["#F96E5B", "#ff8470", "#ff9a85"],
    light: {
      "--bg-color": "#fff5f2", "--text-main": "#220501", "--text-muted": "#23010E",
      "--card-bg": "transparent", "--border": "#ffd4cc", "--accent": "#a3650e",
      "--accent-hover": "#b05b4d", "--base-navy": "#ee897b", "--sub-amber": "#ff9a85",
      "--bq-bg": "#ffe8e4", "--bq-border": "#ffb8b0",
      "--header-bg": "#ee897b",
      "--tab-text-active": "#F96E5B", "--tab-text-muted": "#a3650e",
      "--tab-lamp-color": "#ff8470", "--tab-border-color": "#ffd4cc",
    },
    dark: {
      "--bg-color": "#2e1512", "--text-main": "#ffe8e4", "--text-muted": "#FFF6E5",
      "--card-bg": "transparent", "--border": "#FFE8E4", "--accent": "#ff9a85",
      "--accent-hover": "#F96E5B", "--header-bg": "#2e1512",
      "--bq-bg": "#673932", "--bq-border": "#ff8470",
      "--tab-text-active": "#ffe8e4", "--tab-text-muted": "#ff8470",
      "--tab-lamp-color": "#ff9a85", "--tab-border-color": "#F96E5B",
    },
  },
  {
    id: "earthkhaki", name: "Earth Khaki", tag: "",
    swatches: ["#C2C2C2", "#A69855", "#917051"],
    light: {
      "--bg-color": "#f5f4f0", "--text-main": "#3a3523", "--text-muted": "#6b6348",
      "--card-bg": "transparent", "--border": "#c2c2c2", "--accent": "#917051",
      "--accent-hover": "#a68463", "--base-navy": "#c2c2c2", "--sub-amber": "#a69855",
      "--bq-bg": "#ecebe6", "--bq-border": "#a69855",
      "--header-bg": "#a69855",
      "--tab-text-active": "#3a3523", "--tab-text-muted": "#a69855",
      "--tab-lamp-color": "#917051", "--tab-border-color": "#c2c2c2",
    },
    dark: {
      "--bg-color": "#1e1b15", "--text-main": "#f5f4f0", "--text-muted": "#a69855",
      "--card-bg": "transparent", "--border": "#3a3523", "--accent": "#917051",
      "--accent-hover": "#b59272", "--header-bg": "#1e1b15",
      "--bq-bg": "#2a251b", "--bq-border": "#917051",
      "--tab-text-active": "#f5f4f0", "--tab-text-muted": "#6b6348",
      "--tab-lamp-color": "#917051", "--tab-border-color": "#3a3523",
    },
  },
  {
    id: "ivory", name: "Slate Ivory", tag: "",
    swatches: ["#708090", "#FAF3E0", "#A9A9A9"],
    light: {
      "--bg-color": "#FAF3E0", "--text-main": "#2C2C2C", "--text-muted": "#6B6B6B",
      "--card-bg": "transparent", "--border": "#D4C9B0", "--accent": "#708090",
      "--accent-hover": "#8A9BAD", "--base-navy": "#4A5A6A", "--sub-amber": "#A9A9A9",
      "--bq-bg": "#EDE8DC", "--bq-border": "#C4B89A",
      "--header-bg": "#708090",
      "--tab-text-active": "#2C2C2C", "--tab-text-muted": "#A9A9A9",
      "--tab-lamp-color": "#708090", "--tab-border-color": "#D4C9B0",
    },
    dark: {
      "--bg-color": "#1C1F22", "--text-main": "#FAF3E0", "--text-muted": "#B8B0A0",
      "--card-bg": "transparent", "--border": "#3A3F44", "--accent": "#A9A9A9",
      "--accent-hover": "#C8C8C8", "--header-bg": "#252A2F",
      "--bq-bg": "#2A2F34", "--bq-border": "#4A5058",
      "--tab-lamp-color": "#A9A9A9", "--tab-border-color": "#3A3F44",
    },
  },
  {
    id: "spring", name: "Spring", tag: "",
    swatches: ["#A7D8F0", "#FCE77C", "#F8AFA6"],
    light: {
      "--bg-color": "#fdfefd", "--text-main": "#334155", "--text-muted": "#64748b",
      "--card-bg": "transparent", "--border": "#d9ecf5", "--accent": "#f8afa6",
      "--accent-hover": "#ffc818", "--base-navy": "#8ecfe8", "--sub-amber": "#FCE77C",
      "--bq-bg": "#fff1ef", "--bq-border": "#f8afa6",
      "--header-bg": "#8ecfe8",
      "--tab-text-active": "#334155", "--tab-text-muted": "#94a3b8",
      "--tab-lamp-color": "#f4c84f", "--tab-border-color": "#d9ecf5",
    },
    dark: {
      "--bg-color": "#17212b", "--text-main": "#f8fafc", "--text-muted": "#b6c2cf",
      "--card-bg": "transparent", "--border": "#355064", "--accent": "#FCE77C",
      "--accent-hover": "#ffe98f", "--header-bg": "#213547",
      "--bq-bg": "#3a2d34", "--bq-border": "#f8afa6",
      "--tab-text-active": "#f8fafc", "--tab-text-muted": "#6b7d8c",
      "--tab-lamp-color": "#FCE77C", "--tab-border-color": "#355064",
    },
  },
  {
    id: "ashrose", name: "Ash Rose", tag: "",
    swatches: ["#363034", "#7c6c77", "#b1a3ad"],
    light: {
      "--bg-color": "#e8e3e7", "--text-main": "#363034", "--text-muted": "#7c6c77",
      "--card-bg": "transparent", "--border": "#b1a3ad", "--accent": "#7c6c77",
      "--accent-hover": "#363034", "--base-navy": "#363034", "--sub-amber": "#b1a3ad",
      "--bq-bg": "#f3f1f2", "--bq-border": "#b1a3ad",
      "--header-bg": "#363034",
      "--tab-text-active": "#363034", "--tab-text-muted": "#7c6c77",
      "--tab-lamp-color": "#363034", "--tab-border-color": "#b1a3ad",
    },
    dark: {
      "--bg-color": "#363034", "--text-main": "#e8e3e7", "--text-muted": "#b1a3ad",
      "--card-bg": "transparent", "--border": "#7c6c77", "--accent": "#b1a3ad",
      "--accent-hover": "#e8e3e7", "--header-bg": "#363034",
      "--bq-bg": "#292427", "--bq-border": "#7c6c77",
      "--tab-text-active": "#e8e3e7", "--tab-text-muted": "#7c6c77",
      "--tab-lamp-color": "#b1a3ad", "--tab-border-color": "#7c6c77",
    },
  },
  {
    id: "denim",
    name: "Sage Denim",
    tag: "",
    swatches: ["#446e72", "#9ebb94", "#a8b4c2"],
    light: {
      "--bg-color": "#f4f3e5", "--text-main": "#233739", "--text-muted": "#536b6d",
      "--card-bg": "transparent", "--border": "#d4dbe2", "--accent": "#446e72",
      "--accent-hover": "#568b90", "--base-navy": "#446e72", "--sub-amber": "#9ebb94",
      "--bq-bg": "#e9e8da", "--bq-border": "#cbd4be",
      "--header-bg": "#446e72",
      "--tab-text-active": "#446e72", "--tab-text-muted": "#a8b4c2",
      "--tab-lamp-color": "#446e72", "--tab-border-color": "#d4dbe2",
    },
    dark: {
      "--bg-color": "#1a2729", "--text-main": "#f4f3e5", "--text-muted": "#a8b4c2",
      "--card-bg": "transparent", "--border": "#2d4547", "--accent": "#9ebb94",
      "--accent-hover": "#b1ccaa", "--header-bg": "#1a2729",
      "--bq-bg": "#243538", "--bq-border": "#385356",
      "--tab-text-active": "#f4f3e5", "--tab-text-muted": "#536b6d",
      "--tab-lamp-color": "#9ebb94", "--tab-border-color": "#2d4547",
    },
  },
  {
    id: "navyslate",
    name: "Navy Slate",
    tag: "",
    swatches: ["#1a365d", "#7484c6"],
    light: {
      "--bg-color": "#f5f8fa",
      "--text-main": "#142a4a",
      "--text-muted": "#5e6fae",
      "--card-bg": "transparent",
      "--border": "#dfd9c4",
      "--accent": "#6375b8",
      "--accent-hover": "#173053",
      "--base-navy": "#142a4a",
      "--sub-amber": "#c4ba9b",
      "--bq-bg": "#eaf0f5",
      "--bq-border": "#8090cd",
      "--header-bg": "#142a4a",
      "--tab-text-active": "#142a4a",
      "--tab-text-muted": "#8090cd",
      "--tab-lamp-color": "#c4ba9b",
      "--tab-border-color": "#dfd9c4"
    },
    dark: {
      "--bg-color": "#0c1724",
      "--text-main": "#edf2f6",
      "--text-muted": "#8696d3",
      "--card-bg": "transparent",
      "--border": "#1d3352",
      "--accent": "#dfd9c4",
      "--accent-hover": "#ffffff",
      "--header-bg": "#0c1724",
      "--bq-bg": "#14253d",
      "--bq-border": "#5e6fae",
      "--tab-text-active": "#edf2f6",
      "--tab-text-muted": "#5e6fae",
      "--tab-lamp-color": "#dfd9c4",
      "--tab-border-color": "#1d3352"
    },
  },
{
    id: "rosewood",
    name: "Rose Wood",
    tag: "",
    swatches: ["#93633f", "#dfa89f", "#a3c5c6"],
    light: {
      "--bg-color": "#fcf9f9", "--text-main": "#2b1c1e", "--text-muted": "#6e585a",
      "--card-bg": "transparent", "--border": "#e6d3d5", "--accent": "#aa3f4e",
      "--accent-hover": "#c45464", "--base-navy": "#93633f", "--sub-amber": "#d99aad",
      "--bq-bg": "#f4eaec", "--bq-border": "#dfa89f",
      "--header-bg": "#93633f",
      "--tab-text-active": "#aa3f4e", "--tab-text-muted": "#dfa89f",
      "--tab-lamp-color": "#aa3f4e", "--tab-border-color": "#e6d3d5",
    },
    dark: {
      "--bg-color": "#1a1213", "--text-main": "#f5ecee", "--text-muted": "#ba9fa2",
      "--card-bg": "transparent", "--border": "#4d2f33", "--accent": "#d99aad",
      "--accent-hover": "#e3b1c0", "--base-navy": "#93633f", "--sub-amber": "#d99aad",
      "--bq-bg": "#3d1c21", "--bq-border": "#aa3f4e",
      "--header-bg": "#1a1213",
      "--tab-text-active": "#f5ecee", "--tab-text-muted": "#735155",
      "--tab-lamp-color": "#d99aad", "--tab-border-color": "#4d2f33",
    },
  },
  {
    id: "amethyst",
    name: "Amethyst Garden",
    tag: "",
    swatches: ["#b68882", "#e4e3d1", "#98ab52", "#84c0d2", "#553c9a"],
    light: {
      "--bg-color": "#fafaf6", "--text-main": "#231c36", "--text-muted": "#5b5866",
      "--card-bg": "transparent", "--border": "#e2e1d5", "--accent": "#553c9a",
      "--accent-hover": "#6e54b6", "--base-navy": "#b68882", "--sub-amber": "#98ab52",
      "--bq-bg": "#f4f3ea", "--bq-border": "#84c0d2",
      "--header-bg": "#553c9a",
      "--tab-text-active": "#553c9a", "--tab-text-muted": "#b68882",
      "--tab-lamp-color": "#553c9a", "--tab-border-color": "#e2e1d5",
    },
    dark: {
      "--bg-color": "#171324", "--text-main": "#f0edf7", "--text-muted": "#a39eb5",
      "--card-bg": "transparent", "--border": "#382c59", "--accent": "#84c0d2",
      "--accent-hover": "#a2d2e0", "--header-bg": "#171324",
      "--bq-bg": "#271d42", "--bq-border": "#553c9a",
      "--tab-text-active": "#f0edf7", "--tab-text-muted": "#645c7a",
      "--tab-lamp-color": "#84c0d2", "--tab-border-color": "#382c59",
    },
  },
];

var selected = 0;
var isDark = false;
var currentPage = 1;
var totalPages = Math.ceil(themes.length / PAGE_SIZE);

function vget(theme, key) {
  var vars = isDark ? theme.dark : theme.light;
  return vars[key] || '';
}

function buildMiniMock(t) {
  var bg = vget(t, '--bg-color');
  var hdr = vget(t, '--header-bg');
  var acc = vget(t, '--accent');
  var brd = vget(t, '--border');
  var txt = vget(t, '--text-muted');
  return '<div class="mock" style="background:' + bg + '">'
    + '<div class="mock-header" style="background:' + hdr + '">'
    + '<div class="mock-logo" style="background:rgba(255,255,255,0.25)"></div>'
    + '<div class="mock-nav">'
    + '<span style="background:rgba(255,255,255,0.3)"></span>'
    + '<span style="background:rgba(255,255,255,0.3)"></span>'
    + '<span style="background:rgba(255,255,255,0.3)"></span>'
    + '</div></div>'
    + '<div class="mock-body">'
    + '<div class="mock-main">'
    + '<div class="mock-card-row">'
    + '<div class="mock-card-item" style="background:' + brd + '"></div>'
    + '<div class="mock-card-item" style="background:' + brd + '"></div>'
    + '<div class="mock-card-item accent-fill" style="background:' + acc + '"></div>'
    + '</div>'
    + '<div class="mock-text-line" style="background:' + txt + ';width:80%"></div>'
    + '<div class="mock-text-line" style="background:' + txt + ';width:55%"></div>'
    + '</div>'
    + '<div class="mock-sidebar">'
    + '<div class="mock-sidebar-block s-accent" style="background:' + acc + '"></div>'
    + '<div class="mock-sidebar-block" style="background:' + brd + '"></div>'
    + '<div class="mock-sidebar-block" style="background:' + brd + '"></div>'
    + '</div></div></div>';
}

function buildLargeMock(t) {
  var bg = vget(t, '--bg-color');
  var hdr = vget(t, '--header-bg');
  var acc = vget(t, '--accent');
  var brd = vget(t, '--border');
  var txt = vget(t, '--text-muted');
  var textMain = vget(t, '--text-main');
  var darkClass = isDark ? ' lp-dark' : '';
  var cards = [0,1,2].map(function(i) {
    return '<div class="lp-card-item" style="background:' + brd + '">'
      + '<div class="lp-thumb" style="background:' + (i===2?acc:txt) + '"></div>'
      + '<div class="lp-line" style="background:' + textMain + '"></div>'
      + '<div class="lp-line short" style="background:' + txt + '"></div>'
      + '</div>';
  }).join('');
  var posts = [80,65,72,50].map(function(w) {
    return '<div class="lp-post-item" style="background:' + brd + ';width:' + w + '%"></div>';
  }).join('');
  var sideLinks = [1,0,1,0,1].map(function(a) {
    return '<div class="lp-sidebar-link' + (a?' accent':'') + '" style="background:' + (a?acc:txt) + '"></div>';
  }).join('');
  return '<div class="large-preview' + darkClass + '" style="background:' + bg + '">'
    + '<div class="lp-header" style="background:' + hdr + '">'
    + '<div class="lp-logo-block">'
    + '<div class="lp-logo-text" style="background:rgba(255,255,255,0.3)"></div>'
    + '<div class="lp-logo-sub" style="background:rgba(255,255,255,0.18)"></div>'
    + '</div>'
    + '<div class="lp-nav">'
    + '<div class="lp-nav-item" style="background:rgba(255,255,255,0.35)"></div>'
    + '<div class="lp-nav-item" style="background:rgba(255,255,255,0.35)"></div>'
    + '<div class="lp-nav-item" style="background:rgba(255,255,255,0.35)"></div>'
    + '<div class="lp-nav-btn" style="background:' + acc + '"></div>'
    + '</div></div>'
    + '<div class="lp-body">'
    + '<div class="lp-main">'
    + '<div class="lp-card-row">' + cards + '</div>'
    + '<div class="lp-post-list">' + posts + '</div>'
    + '</div>'
    + '<div class="lp-sidebar">'
    + '<div class="lp-sidebar-title" style="background:' + textMain + '"></div>'
    + '<div class="lp-sidebar-block" style="background:' + acc + ';opacity:0.35"></div>'
    + '<div class="lp-sidebar-links">' + sideLinks + '</div>'
    + '<div class="lp-sidebar-block" style="background:' + brd + '"></div>'
    + '</div>'
    + '</div></div>';
}

function buildCSS(t) {
  var li = t.light;
  var dk = t.dark;
  var lLines = Object.keys(li).map(function(k){ return '      ' + k + ': ' + li[k] + ';'; }).join('\n');
  var dLines = Object.keys(dk).map(function(k){ return '         ' + k + ': ' + dk[k] + ';'; }).join('\n');
  var dLines2 = Object.keys(dk).map(function(k){ return '      ' + k + ': ' + dk[k] + ';'; }).join('\n');
  return ':root {\n' + lLines + '\n      color-scheme: light;\n   }\n\n'
    + '@media (prefers-color-scheme: dark) {\n\thtml:not([data-theme="light"]) {\n' + dLines + '\n         color-scheme: dark;\n      }\n   }\n\n'
    + 'html[data-theme="dark"] {\n' + dLines2 + '\n      color-scheme: dark;\n   }\n\n'
    + 'html[data-theme="light"] {\n\tcolor-scheme: light;\n   }';
}

/* ===== ページネーション描画 ===== */
function renderPagination() {
  var el = document.getElementById('tp-pagination');
  if (!el) return;

  /* テーマが PAGE_SIZE 以下ならページネーション不要 */
  if (themes.length <= PAGE_SIZE) {
    el.innerHTML = '';
    return;
  }

  totalPages = Math.ceil(themes.length / PAGE_SIZE);
  var html = '';

  /* 前へ */
  html += '<button class="tp-page-btn" id="pg-prev"'
    + (currentPage <= 1 ? ' disabled' : '') + '>&#8592; 前へ</button>';

  /* ページ番号ボタン */
  for (var p = 1; p <= totalPages; p++) {
    html += '<button class="tp-page-btn' + (p === currentPage ? ' active' : '')
      + '" data-pg="' + p + '">' + p + '</button>';
  }

  /* 次へ */
  html += '<button class="tp-page-btn" id="pg-next"'
    + (currentPage >= totalPages ? ' disabled' : '') + '>次へ &#8594;</button>';

  /* 件数情報 */
  var start = (currentPage - 1) * PAGE_SIZE + 1;
  var end = Math.min(currentPage * PAGE_SIZE, themes.length);
  html += '<span class="tp-page-info">' + start + '–' + end + ' / ' + themes.length + ' テーマ</span>';

  el.innerHTML = html;

  /* イベント */
  var prev = el.querySelector('#pg-prev');
  var next = el.querySelector('#pg-next');
  if (prev) prev.addEventListener('click', function() { goPage(currentPage - 1); });
  if (next) next.addEventListener('click', function() { goPage(currentPage + 1); });
  el.querySelectorAll('[data-pg]').forEach(function(btn) {
    btn.addEventListener('click', function() { goPage(parseInt(this.getAttribute('data-pg'))); });
  });
}

function goPage(p) {
  totalPages = Math.ceil(themes.length / PAGE_SIZE);
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  renderGrid();
  renderPagination();
  /* グリッドの先頭へスクロール */
  var grid = document.getElementById('tp-grid');
  if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ===== グリッド描画（現在ページ分のみ） ===== */
function renderGrid() {
  var grid = document.getElementById('tp-grid');
  if (!grid) return;

  var start = (currentPage - 1) * PAGE_SIZE;
  var end = Math.min(start + PAGE_SIZE, themes.length);
  var pageThemes = themes.slice(start, end);

  var html = '';
  for (var i = 0; i < pageThemes.length; i++) {
    var globalIdx = start + i;
    var t = pageThemes[i];
    var swHtml = t.swatches.map(function(c){
      return '<div class="tp-swatch" style="background:' + c + '"></div>';
    }).join('');
    html += '<div class="tp-card' + (globalIdx === selected ? ' active' : '')
      + '" data-i="' + globalIdx + '">'
      + buildMiniMock(t)
      + '<div class="tp-info">'
      + '<div class="tp-swatch-row">' + swHtml + '</div>'
      + '<span class="tp-name">' + t.name + '</span>'
      + '<span class="tp-badge">選択中</span>'
      + '</div></div>';
  }
  grid.innerHTML = html;

  grid.querySelectorAll('.tp-card').forEach(function(card) {
    card.addEventListener('click', function() {
      selected = parseInt(this.getAttribute('data-i'));
      render();
    });
  });
}

function renderPreview() {
  var t = themes[selected];
  var nameEl = document.getElementById('preview-name');
  if (nameEl) nameEl.textContent = t.name;
  var panel = document.querySelector('.tp-preview-panel');
  if (!panel) return;
  var existing = panel.querySelector('.large-preview');
  if (existing) {
    var dummy = document.createElement('div');
    dummy.innerHTML = buildLargeMock(t);
    existing.parentNode.replaceChild(dummy.firstElementChild, existing);
  }
}

function renderCSS() {
  var el = document.getElementById('css-output');
  if (el) el.textContent = buildCSS(themes[selected]);
}

function renderApplyBtn() {
  var slugMap = {
    amber:'amber-classic', deepblue:'deep-blue', darkgreen:'dark-green',
    terracotta:'deep-maroon', olive:'burnt-orange', indigo:'midnight-blue',
    coral:'coral-red', peach:'peach', salmon:'salmon', earthkhaki:'earth-khaki',
    ivory:'slate-ivory', spring:'spring', ashrose:'ash-rose', denim:'sage-denim',
    navyslate:'navy-slate',rosewood:'rose-wood',amethyst:'amethyst-garden'
  };
  var t = themes[selected];
  var slug = slugMap[t.id] || t.id;
  var sideLink = document.getElementById('color-preview-link');
  if (sideLink) sideLink.href = 'https://m-strux.matsusanjpn.com/p/color-' + slug + '.html';
}

function render() {
  renderGrid();
  renderPagination();
  renderPreview();
  renderCSS();
  renderApplyBtn();
}

/* ===== 「公式サイトで試す」ボタン ===== */
var applyBtn = document.getElementById('tp-apply-btn');
if (applyBtn) {
  applyBtn.addEventListener('click', function() {
    var slugMap = {
      amber:'amber-classic', deepblue:'deep-blue', darkgreen:'dark-green',
      terracotta:'deep-maroon', olive:'burnt-orange', indigo:'midnight-blue',
      coral:'coral-red', peach:'peach', salmon:'salmon', earthkhaki:'earth-khaki',
      ivory:'slate-ivory', spring:'spring', ashrose:'ash-rose', denim:'sage-denim',
      navyslate:'navy-slate',rosewood:'rose-wood',amethyst:'amethyst-garden'
    };
    var t = themes[selected];
    var slug = slugMap[t.id] || t.id;
    location.href = 'https://m-strux.matsusanjpn.com/p/color-' + slug + '.html';
  });
}

/* ===== ダークモード toggle ===== */
var darkToggle = document.getElementById('dark-toggle');
if (darkToggle) {
  darkToggle.addEventListener('change', function() {
    isDark = this.checked;
    document.body.classList.toggle('dark-mode', isDark);
    render();
  });
}

/* ===== CSSコピー ===== */
var copyBtn = document.getElementById('tp-copy-btn');
if (copyBtn) {
  copyBtn.addEventListener('click', function() {
    var self = this;
    var text = document.getElementById('css-output').textContent;
    var done = function() {
      self.textContent = 'コピー完了 ✓';
      self.classList.add('copied');
      setTimeout(function() { self.textContent = 'コピー'; self.classList.remove('copied'); }, 2000);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    }
  });
}

/* ===== 初期描画 ===== */
function init() {
  var grid = document.getElementById('tp-grid');
  if (!grid) {
    var observer = new MutationObserver(function(_, obs) {
      if (document.getElementById('tp-grid')) {
        obs.disconnect();
        render();
      }
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
    return;
  }
  render();
}

init();

})();
