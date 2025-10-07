<p align="center">
  <img
    src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=28&duration=2500&pause=800&center=true&vCenter=true&width=650&lines=%E2%9E%AE%F0%9F%93%B1%20Instalaci%C3%B3n%20por%20termux&color=00E5FF" alt="➮📱 Instalación por termux"
  />
</p>

### **`✧ Click en la imagen para descargar termux ✧`**
<a
href="https://www.mediafire.com/file/llugt4zgj7g3n3u/com.termux_1020.apk/file"><img src="https://qu.ax/finc.jpg" height="125px"></a> 

<details>
 <summary><b>🕸️ Ver comandos de instalación </b></summary>

### **🎄🚀 Instalación Rápida 🌛**

```bash
termux-setup-storage
```

```bash
pkg update && pkg upgrade -y
```

```bash
pkg install git nodejs ffmpeg imagemagick yarn -y
```

```bash
git clone https://github.com/carlos13ra/SANTAFLOW-BOT && cd SANTAFLOW-BOT
```

```bash
yarn install
```

```bash
npm install
```

```bash
npm start
```

> Si aparece (Y/I/N/O/D/Z) [default=N] ? use la letra "y" + "ENTER" para continuar con la instalación

</details>

![line](https://github.com/Yuji-XDev/Yuji-XDev/blob/main/shadow'core/line.gif)

<details>
 <summary><b>🫛 Activar en caso de detenerse el Termux </b></summary>

> Si después de instalar el bot en Termux se detiene (pantalla en blanco, pérdida de conexión a Internet, reinicio del dispositivo), sigue estos pasos:

❒ Abre Termux y navega al directorio del bot:
   
```bash
cd SANTAFLOW-BOT
```

❒ Inicia el bot nuevamente:
  
```bash
npm start
```
</details>

![line](https://github.com/Yuji-XDev/Yuji-XDev/blob/main/shadow'core/line.gif)

<details>
 <summary><b>🍉 Obtener otro código QR en Termux</b></summary>

> Si después de instalar el bot en Termux y iniciar la session del bot (el numero se va a soporte, se cierra la conexión o demorastes al conectar), sigue estos pasos:

1. Abre Termux y navega al directorio del bot:

```bash
cd SANTAFLOW-BOT
```

2. Elimina la carpeta MiniSession:

```bash
rm -rf Sessions
```

3. Inicia el bot nuevamente:

```bash
npm start
```
</details>

![line](https://github.com/Yuji-XDev/Yuji-XDev/blob/main/shadow'core/line.gif)

<details>
 <summary><b>🎋 Volverte owner del bot</b></summary>

> Si después de instalar el bot en Termux y iniciar la session del bot (deseas poner tu número es la lista de owner pon este comando:

```bash
cd SANTAFLOW-BOT && nano config.js
```
</details>

![line](https://github.com/Yuji-XDev/Yuji-XDev/blob/main/shadow'core/line.gif)

<details>
 <summary><b>🌿 Actualiza el bot a su última vs</b></summary>
 ```
 grep -q 'bash\|wget' <(dpkg -l) || apt install -y bash wget && wget -O - https://raw.githubusercontent.com/carlos13ra/SANTAFLOW-BOT/main/update.sh | bash 
 ```
 </details>