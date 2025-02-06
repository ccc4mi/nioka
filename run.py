import os
from flask import Flask, render_template, request, redirect, url_for,session,flash,jsonify
from models import db, Nota, User,Entrada
import random
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='static')
app.config.from_pyfile('config.py')
app.secret_key = os.urandom(24)
db.init_app(app)

with app.app_context():
    db_path = os.path.join(app.config['BASE_DIR'], 'instance', 'datos.sqlite3')
    if not os.path.exists(db_path):
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        db.create_all()
        print("Base de datos creada en:", db_path)
    else:
        print("Base de datos ya existe en:", db_path)


def generar_id_nota():
    while True:
        id_nota = random.randint(1000, 9999)
        if not Nota.query.filter_by(id=id_nota).first():
            return id_nota

#--------------------------------------Inicio-------------------------------------

@app.route('/', methods=['GET', 'POST'])
def inicio():
    if request.method == 'POST':
        texto = request.form['texto']
        nueva_nota = Nota(id=generar_id_nota(), texto=texto, fecha=datetime.now())
        try:
            db.session.add(nueva_nota)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
        return redirect(url_for('inicio'))
    
    
    return render_template('inicio.html')

#----------------------------------Feed------------------------------------------
@app.route('/feed', methods=['GET', 'POST'])
def feed():
    entradas = Entrada.query.order_by(Entrada.fecha.desc()).all()  # Obtener todas las entradas ordenadas por fecha
    return render_template('feed.html', entradas=entradas)


#---------------------------------Inicio de sesión-------------------------------------
@app.route('/iniciarSesion', methods=['GET', 'POST'])
def iniciarSesion():
    if request.method == 'POST':
        id_u = request.form.get('id')
        pw = request.form.get('password')

        # Verificar si los datos del user son correctos en la bd
        user = User.query.filter_by(id=id_u, password=pw).first()

        if user:
            session['user_id'] = user.id  
            return redirect(url_for('userHome'))
        else:
            flash('Error: datos incorrectos.', 'error')

    return render_template('iniciarSesion.html')

#--------------------------------Home del Usuario-------------------------------------
@app.route('/userHome', methods=['GET', 'POST'])
def userHome():
    if 'user_id' not in session:
        return redirect(url_for('iniciarSesion'))

    if request.method == 'POST':
        titulo = request.form['titulo']
        contenido = request.form['contenido']
        nueva_entrada = Entrada(titulo=titulo, contenido=contenido, user_id=session['user_id'])
        try:
            db.session.add(nueva_entrada)
            db.session.commit()
            flash('Entrada creada exitosamente!', 'success')
            return redirect(url_for('userHome'))
        except Exception as e:
            db.session.rollback()
            flash('Error al crear la entrada.', 'error')

    return render_template('userHome.html')



#-----------------------------------mensajes----------------------------------------
@app.route('/mensajes', methods=['GET', 'POST'])
def mensajes():
    if 'user_id' in session:
        user = User.query.filter_by(id=session['user_id']).first()
        
        if request.method == 'POST':
            notas_a_eliminar = request.form.getlist('notas_a_eliminar')
            if notas_a_eliminar:
                for nota_id in notas_a_eliminar:
                    nota = Nota.query.get(nota_id)
                    if nota:
                        db.session.delete(nota)
                db.session.commit()
            return redirect(url_for('mensajes'))
        
        notas = Nota.query.order_by(Nota.fecha.desc()).all()
        return render_template('mensajes.html', notas=notas)
    else:
        return redirect(url_for('userHome'))
    



if __name__ == '__main__':
    app.run(debug=True)