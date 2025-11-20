#!/bin/bash

# Script con comandos útiles para administrar la aplicación

echo "==================================="
echo "Comandos Útiles - Encuestas App"
echo "==================================="
echo ""

show_menu() {
    echo "Selecciona una opción:"
    echo ""
    echo "1) Ver estado del servicio backend"
    echo "2) Ver logs del backend (últimas 50 líneas)"
    echo "3) Ver logs del backend en tiempo real"
    echo "4) Reiniciar backend"
    echo "5) Reiniciar Nginx"
    echo "6) Ver logs de Nginx (access)"
    echo "7) Ver logs de Nginx (errors)"
    echo "8) Actualizar aplicación desde Git"
    echo "9) Reconstruir frontend"
    echo "10) Reiniciar base de datos"
    echo "11) Ver estado de todos los servicios"
    echo "12) Verificar puertos en uso"
    echo "0) Salir"
    echo ""
}

while true; do
    show_menu
    read -p "Opción: " option

    case $option in
        1)
            echo "Estado del servicio backend:"
            sudo systemctl status encuestas
            ;;
        2)
            echo "Últimas 50 líneas de logs del backend:"
            sudo journalctl -u encuestas -n 50 --no-pager
            ;;
        3)
            echo "Logs del backend en tiempo real (Ctrl+C para salir):"
            sudo journalctl -u encuestas -f
            ;;
        4)
            echo "Reiniciando backend..."
            sudo systemctl restart encuestas
            echo "Backend reiniciado. Estado:"
            sudo systemctl status encuestas --no-pager
            ;;
        5)
            echo "Reiniciando Nginx..."
            sudo systemctl restart nginx
            echo "Nginx reiniciado. Estado:"
            sudo systemctl status nginx --no-pager
            ;;
        6)
            echo "Logs de acceso de Nginx:"
            sudo tail -50 /var/log/nginx/encuestas_access.log
            ;;
        7)
            echo "Logs de errores de Nginx:"
            sudo tail -50 /var/log/nginx/encuestas_error.log
            ;;
        8)
            echo "Actualizando desde Git..."
            cd /var/www/encuestas
            git pull
            echo "Actualizando backend..."
            cd backend
            source venv/bin/activate
            pip install -r requirements.txt
            sudo systemctl restart encuestas
            echo "Reconstruyendo frontend..."
            cd ../frontend
            npm install
            npm run build
            sudo systemctl reload nginx
            echo "¡Actualización completada!"
            ;;
        9)
            echo "Reconstruyendo frontend..."
            cd /var/www/encuestas/frontend
            npm install
            npm run build
            sudo systemctl reload nginx
            echo "Frontend reconstruido"
            ;;
        10)
            read -p "¿Estás seguro de reiniciar la base de datos? Esto borrará todos los votos (s/N): " confirm
            if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
                echo "Reiniciando base de datos..."
                curl -X POST http://localhost:5000/api/init-db
                echo "Base de datos reiniciada"
            else
                echo "Operación cancelada"
            fi
            ;;
        11)
            echo "Estado de todos los servicios:"
            echo ""
            echo "=== Backend ==="
            sudo systemctl status encuestas --no-pager | head -5
            echo ""
            echo "=== Nginx ==="
            sudo systemctl status nginx --no-pager | head -5
            echo ""
            echo "=== PostgreSQL ==="
            sudo systemctl status postgresql --no-pager | head -5
            ;;
        12)
            echo "Puertos en uso:"
            sudo netstat -tlnp | grep -E ':(80|443|5000|5432)'
            ;;
        0)
            echo "¡Hasta luego!"
            exit 0
            ;;
        *)
            echo "Opción inválida"
            ;;
    esac

    echo ""
    read -p "Presiona Enter para continuar..."
    clear
done
