// 1. Inisialisasi Peta ke Koordinat Kota Bandar Lampung
var map = L.map('map').setView([-5.4292, 105.2611], 13); 

// 2. Tile Layer / Basemap (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 3. Ikon DivIcon Bentuk Hati Pink Lucu
var pinkHeartIcon = L.divIcon({
    className: 'custom-pink-marker',
    html: '<div class="heart-pin">💖</div>',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
});

// 4. Memuat File Data Wisata.geojson
fetch('Wisata.geojson')
    .then(response => response.json())
    .then(data => {
        var geojsonLayer = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: pinkHeartIcon });
            },
            onEachFeature: function (feature, layer) {
                var namaWisata = feature.properties.Name || "Tanpa Nama";
                
                layer.bindPopup("<b style='color: #d14780; font-size:14px;'>" + namaWisata + "</b>");

                var listContainer = document.getElementById('wisata-list');
                var item = document.createElement('div');
                item.className = 'wisata-item';
                item.innerHTML = "🌸 " + namaWisata;
                
                item.onclick = function() {
                    map.flyTo(layer.getLatLng(), 16, {
                        animate: true,
                        duration: 1.2
                    });
                    layer.openPopup();
                };
                
                listContainer.appendChild(item);
            }
        }).addTo(map);

        // Fitur Pencarian Wisata
        document.getElementById('search-input').addEventListener('input', function(e) {
            var searchText = e.target.value.toLowerCase();
            var items = document.getElementsByClassName('wisata-item');
            
            for (var i = 0; i < items.length; i++) {
                var text = items[i].innerText.toLowerCase();
                if (text.includes(searchText)) {
                    items[i].style.display = "block";
                } else {
                    items[i].style.display = "none";
                }
            }
        });
    })
    .catch(error => console.error('Error memuat file GeoJSON:', error));

// 5. Logika Interaktif Navigasi Aktif Saat Halaman Di-scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});