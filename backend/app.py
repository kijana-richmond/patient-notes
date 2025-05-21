from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Patient, Note
from config import Config
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(levelname)s: %(message)s'
)

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

# Simple CORS configuration
CORS(app, origins=['http://localhost:5173'])


@app.route('/patients', methods=['GET'])
def get_patients():
    app.logger.info('Fetching all patients')
    patients = db.session.execute(db.select(Patient)).scalars().all()
    return jsonify([patient.to_dict() for patient in patients])

@app.route('/patients/<patient_id>', methods=['GET'])
def get_patient(patient_id):
    app.logger.info(f'Fetching patient with ID: {patient_id}')
    patient = db.session.execute(db.select(Patient).filter_by(id=patient_id)).scalar_one_or_none()
    if patient is None:
        app.logger.warning(f'Patient not found with ID: {patient_id}')
        return jsonify({'error': 'Patient not found'}), 404
    return jsonify(patient.to_dict())

@app.route('/patients', methods=['POST'])
def create_patient():
    app.logger.info('Creating new patient')
    data = request.json
    try:
        patient = Patient(
            name=data['name'],
            date_of_birth=data['date_of_birth'],
            gender=data['gender']
        )
        db.session.add(patient)
        db.session.commit()
        app.logger.info(f'Successfully created patient with ID: {patient.id}')
        return jsonify(patient.to_dict()), 201
    except Exception as e:
        app.logger.error(f'Error creating patient: {str(e)}')
        db.session.rollback()
        return jsonify({'error': 'Failed to create patient'}), 400

@app.route('/patients/<patient_id>', methods=['PUT'])
def update_patient(patient_id):
    app.logger.info(f'Updating patient with ID: {patient_id}')
    data = request.json
    patient = db.session.execute(db.select(Patient).filter_by(id=patient_id)).scalar_one_or_none()
    if patient is None:
        app.logger.warning(f'Patient not found with ID: {patient_id}')
        return jsonify({'error': 'Patient not found'}), 404
    try:
        patient.name = data['name']
        patient.date_of_birth = data['date_of_birth']
        patient.gender = data['gender']
        db.session.commit()
        app.logger.info(f'Successfully updated patient with ID: {patient_id}')
        return jsonify(patient.to_dict()), 200
    except Exception as e:
        app.logger.error(f'Error updating patient: {str(e)}')
        db.session.rollback()
        return jsonify({'error': 'Failed to update patient'}), 400

@app.route('/patients/<patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    app.logger.info(f'Deleting patient with ID: {patient_id}')
    patient = db.session.execute(db.select(Patient).filter_by(id=patient_id)).scalar_one_or_none()
    if patient is None:
        app.logger.warning(f'Patient not found with ID: {patient_id}')
        return jsonify({'error': 'Patient not found'}), 404
    try:
        db.session.delete(patient)
        db.session.commit()
        app.logger.info(f'Successfully deleted patient with ID: {patient_id}')
        return '', 204
    except Exception as e:
        app.logger.error(f'Error deleting patient: {str(e)}')
        db.session.rollback()
        return jsonify({'error': 'Failed to delete patient'}), 400
    
    

@app.route('/notes', methods=['GET'])
def get_notes():
    app.logger.info('Fetching all notes')
    notes = db.session.execute(db.select(Note)).scalars().all()
    return jsonify([note.to_dict() for note in notes])

@app.route('/notes/<note_id>', methods=['GET'])
def get_note(note_id):
    app.logger.info(f'Fetching note with ID: {note_id}')
    note = db.session.execute(db.select(Note).filter_by(id=note_id)).scalar_one_or_none()
    if note is None:
        app.logger.warning(f'Note not found with ID: {note_id}')
        return jsonify({'error': 'Note not found'}), 404
    return jsonify(note.to_dict())

@app.route('/patients/<patient_id>/notes', methods=['GET'])
def get_patient_notes(patient_id):
    app.logger.info(f'Fetching notes for patient ID: {patient_id}')
    notes = db.session.execute(db.select(Note).filter_by(patient_id=patient_id)).scalars().all()
    return jsonify([note.to_dict() for note in notes])

@app.route('/patients/<patient_id>/notes', methods=['POST'])
def create_note(patient_id):
    app.logger.info(f'Creating note for patient ID: {patient_id}')
    data = request.json
    try:
        note = Note(
            patient_id=patient_id,
            content=data['content']
        )
        db.session.add(note)
        db.session.commit()
        app.logger.info(f'Successfully created note with ID: {note.id}')
        return jsonify(note.to_dict()), 201
    except Exception as e:
        app.logger.error(f'Error creating note: {str(e)}')
        db.session.rollback()
        return jsonify({'error': 'Failed to create note'}), 400

@app.route('/notes/<note_id>', methods=['PUT'])
def update_note(note_id):
    app.logger.info(f'Updating note with ID: {note_id}')
    data = request.json
    note = db.session.execute(db.select(Note).filter_by(id=note_id)).scalar_one_or_none()
    if note is None:
        app.logger.warning(f'Note not found with ID: {note_id}')
        return jsonify({'error': 'Note not found'}), 404
    try:
        note.content = data['content']
        db.session.commit()
        app.logger.info(f'Successfully updated note with ID: {note_id}')
        return jsonify(note.to_dict()), 200
    except Exception as e:
        app.logger.error(f'Error updating note: {str(e)}')
        db.session.rollback()
        return jsonify({'error': 'Failed to update note'}), 400

@app.route('/notes/<note_id>', methods=['DELETE'])
def delete_note(note_id):
    app.logger.info(f'Deleting note with ID: {note_id}')
    note = db.session.execute(db.select(Note).filter_by(id=note_id)).scalar_one_or_none()
    if note is None:
        app.logger.warning(f'Note not found with ID: {note_id}')
        return jsonify({'error': 'Note not found'}), 404
    try:
        db.session.delete(note)
        db.session.commit()
        app.logger.info(f'Successfully deleted note with ID: {note_id}')
        return '', 204
    except Exception as e:
        app.logger.error(f'Error deleting note: {str(e)}')
        db.session.rollback()
        return jsonify({'error': 'Failed to delete note'}), 400

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.logger.info('Starting application...')
    app.run(host='0.0.0.0', port=3000, debug=True)