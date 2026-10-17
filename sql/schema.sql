CREATE TABLE IF NOT EXISTS estudiantes (
  id_estudiante INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  edad INT NOT NULL,
  nivel ENUM('pre_primario', 'primario') NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS actividades (
  id_actividad INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL UNIQUE,
  categoria VARCHAR(50) NOT NULL,
  nivel ENUM('pre_primario', 'primario') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS progresos (
  id_progreso INT AUTO_INCREMENT PRIMARY KEY,
  id_estudiante INT NOT NULL,
  id_actividad INT NOT NULL,
  puntuacion INT NOT NULL,
  fecha_jugado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_progreso_estudiante
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_progreso_actividad
    FOREIGN KEY (id_actividad) REFERENCES actividades(id_actividad)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT IGNORE INTO actividades (titulo, categoria, nivel) VALUES
  ('Adentro / Afuera', 'Espacial', 'pre_primario'),
  ('Arriba / Abajo', 'Espacial', 'pre_primario'),
  ('Cerca / Lejos', 'Espacial', 'pre_primario'),
  ('Encima / Debajo', 'Espacial', 'pre_primario'),
  ('Figuras Geométricas', 'Geometría', 'pre_primario'),
  ('Juego de Memoria', 'Memoria', 'pre_primario'),
  ('Tablas de Multiplicar', 'Matemáticas', 'primario'),
  ('Suma de Quebrados', 'Matemáticas', 'primario'),
  ('Multiplicación con Decimales', 'Matemáticas', 'primario');
