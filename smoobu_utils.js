const qs = require('qs');
const axios = require("axios");


module.exports.getSmoobuNewAccessToken = async function ({clientId, refreshToken, client_secret}) {

    // URL encode the request body
    const data = qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: client_secret,
    });

    const config = {
        method: 'post',
        url: 'https://login.smoobu.com/oauth/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
    };

    try {
        const response = await axios(config);
        return response.data.access_token;
    } catch (error) {
        console.error('Failed to refresh token:', error.response ? error.response.data : error.message);
    }
}


module.exports.getSmoobuApartments = async function getApartments(smoobuAccessToken) {

    const config = {
        method: 'get',
        url: 'https://login.smoobu.com/api/apartments',
        headers: {
            'Authorization': `Bearer ${smoobuAccessToken}`,
            'Cache-Control': 'no-cache'
        }
    };

    const response = await axios(config);
    if (response.status == 401) {
        throw response.data.status;
    } else {
        return response.data.apartments;
    }

}

module.exports.getSmoobuBookingsByApartmentId = async function getBookingsByApartmentId({
                                                                                            smoobuAccessToken,
                                                                                            apartmentId
                                                                                        }) {

    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://login.smoobu.com/api/reservations?apartmentId=${apartmentId}&from=1960-01-01`,
        headers: {
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${smoobuAccessToken}`
        }
    };

    const response = await axios(config);
    if (response.status == 401) {
        throw response.data.status;
    } else {
        return response.data.bookings;
    }

}


module.exports.getNotificationContent = function getNotificationContent(
    {
        type,
        langCode,
        urlRef,
    }
) {
    /// MODIFY CODE ONLY BELOW THIS LINE

    const messages = {
        'property': {
            "en": "Your property import has completed successfully.",
            "de": "Der Import Ihrer Immobilie wurde erfolgreich abgeschlossen.",
            "it":
                "L'importazione della tua proprietà è stata completata con successo.",
            "es": "La importación de su propiedad ha finalizado con éxito.",
            "fr": "L'importation de votre propriété a été réalisée avec succès.",
            "el": "Η εισαγωγή της ιδιοκτησίας σας ολοκληρώθηκε με επιτυχία.",
            "pt": "A importação do seu imóvel foi concluída com sucesso."
        },
        'property_failed': {
            "en": "The import of your property has failed.",
            "de": "Der Import Ihrer Immobilie ist fehlgeschlagen.",
            "it": "L'importazione della tua proprietà è fallita.",
            "es": "La importación de su propiedad ha fallado.",
            "fr": "L'importation de votre propriété a échoué.",
            "el": "Η εισαγωγή της ιδιοκτησίας σας απέτυχε.",
            "pt": "A importação do seu imóvel falhou."
        },
        'reviews': {
            "en": "The import of your property reviews has completed successfully.",
            "de":
                "Der Import Ihrer Immobilienbewertungen wurde erfolgreich abgeschlossen.",
            "it":
                "L'importazione delle recensioni della tua proprietà è stata completata con successo.",
            "es":
                "La importación de las reseñas de su propiedad ha finalizado con éxito.",
            "fr":
                "L'importation de vos avis sur la propriété a été réalisée avec succès.",
            "el":
                "Η εισαγωγή των κριτικών της ιδιοκτησίας σας ολοκληρώθηκε με επιτυχία.",
            "pt":
                "A importação das avaliações do seu imóvel foi concluída com sucesso."
        },
        'photos': {
            "en": "The import of your property photos has completed successfully.",
            "de": "Der Import Ihrer Immobilienfotos wurde erfolgreich abgeschlossen.",
            "it":
                "L'importazione delle foto della tua proprietà è stata completata con successo.",
            "es":
                "La importación de las fotos de su propiedad ha finalizado con éxito.",
            "fr":
                "L'importation des photos de votre propriété a été réalisée avec succès.",
            "el":
                "Η εισαγωγή των φωτογραφιών της ιδιοκτησίας σας ολοκληρώθηκε με επιτυχία.",
            "pt": "A importação das fotos do seu imóvel foi concluída com sucesso."
        },
        'booking_customer_verified': {
            "en": "The customer has verified their identity at the booking form.",
            "de": "Der Kunde hat seine Identität im Buchungsformular verifiziert.",
            "it":
                "Il cliente ha verificato la propria identità nel modulo di prenotazione.",
            "es":
                "El cliente ha verificado su identidad en el formulario de reserva.",
            "fr":
                "Le client a vérifié son identité sur le formulaire de réservation.",
            "el": "Ο πελάτης έχει επαληθεύσει την ταυτότητά του στη φόρμα κράτησης.",
            "pt": "O cliente verificou sua identidade no formulário de reserva."
        },
        'booking_customer_paid': {
            "en": "The customer has paid the security cost at the booking form.",
            "de": "Der Kunde hat die Sicherheitskosten im Buchungsformular bezahlt.",
            "it":
                "Il cliente ha pagato il costo di sicurezza nel modulo di prenotazione.",
            "es":
                "El cliente ha pagado el costo de seguridad en el formulario de reserva.",
            "fr":
                "Le client a payé le coût de sécurité sur le formulaire de réservation.",
            "el": "Ο πελάτης πλήρωσε το κόστος ασφάλειας στη φόρμα κράτησης.",
            "pt": "O cliente pagou o custo de segurança no formulário de reserva."
        },
        'booking_customer_filled_in': {
            "en": "The customer has filled in the custom fields at the booking form.",
            "de":
                "Der Kunde hat die benutzerdefinierten Felder im Buchungsformular ausgefüllt.",
            "it":
                "Il cliente ha compilato i campi personalizzati nel modulo di prenotazione.",
            "es":
                "El cliente ha completado los campos personalizados en el formulario de reserva.",
            "fr":
                "Le client a rempli les champs personnalisés sur le formulaire de réservation.",
            "el":
                "Ο πελάτης έχει συμπληρώσει τα προσαρμοσμένα πεδία στη φόρμα κράτησης.",
            "pt":
                "O cliente preencheu os campos personalizados no formulário de reserva."
        },
        'insurance_claim': {
            "en": "The user is asking for an insurance claim.",
            "de": "Der Benutzer beantragt einen Versicherungsanspruch.",
            "it": "L'utente sta richiedendo un risarcimento assicurativo.",
            "es": "El usuario está solicitando un reclamo de seguro.",
            "fr": "L'utilisateur demande une réclamation d'assurance.",
            "el": "Ο χρήστης ζητά αποζημίωση ασφάλισης.",
            "pt": "O usuário está pedindo um sinistro de seguro."
        },
        'deposit_claim': {
            "en": "The user is asking for a deposit claim.",
            "de": "Der Benutzer beantragt einen Einlagenanspruch.",
            "it": "L'utente sta richiedendo un reclamo di deposito.",
            "es": "El usuario está solicitando un reclamo de depósito.",
            "fr": "L'utilisateur demande une réclamation de dépôt.",
            "el": "Ο χρήστης ζητά αξίωση κατάθεσης.",
            "pt": "O usuário está pedindo uma reivindicação de depósito."
        },
        'user_insurance_update': {
            "en": "The admin has updated the insurance claim request.",
            "de":
                "Der Administrator hat die Versicherungsanspruchsanforderung aktualisiert.",
            "it":
                "L'amministratore ha aggiornato la richiesta di risarcimento assicurativo.",
            "es":
                "El administrador ha actualizado la solicitud de reclamo de seguro.",
            "fr":
                "L'administrateur a mis à jour la demande de réclamation d'assurance.",
            "el": "Ο διαχειριστής έχει ενημερώσει το αίτημα αξίωσης ασφάλισης.",
            "pt": "O administrador atualizou o pedido de sinistro do seguro."
        },
        'user_deposit_update': {
            "en": "The admin has updated the deposit claim request.",
            "de": "Der Administrator hat die Einlagenforderung aktualisiert.",
            "it":
                "L'amministratore ha aggiornato la richiesta di reclamo di deposito.",
            "es":
                "El administrador ha actualizado la solicitud de reclamo de depósito.",
            "fr": "L'administrateur a mis à jour la demande de réclamation de dépôt.",
            "el": "Ο διαχειριστής έχει ενημερώσει το αίτημα αξίωσης κατάθεσης.",
            "pt": "O administrador atualizou o pedido de reclamação de depósito."
        },
        'booking_message': {
            "en": "The customer has replied to your booking message.",
            "de": "Der Kunde hat auf Ihre Buchungsnachricht geantwortet.",
            "it": "Il cliente ha risposto al tuo messaggio di prenotazione.",
            "es": "El cliente ha respondido a tu mensaje de reserva.",
            "fr": "Le client a répondu à votre message de réservation.",
            "el": "Ο πελάτης έχει απαντήσει στο μήνυμα κράτησής σας.",
            "pt": "O cliente respondeu à sua mensagem de reserva."
        },
        'reviews_failed': {
            "en": "The import of your property reviews has failed.",
            "de": "Der Import Ihrer Immobilienbewertungen ist fehlgeschlagen.",
            "it": "L'importazione delle recensioni della tua proprietà è fallita.",
            "es": "La importación de las reseñas de su propiedad ha fallado.",
            "fr": "L'importation de vos avis sur la propriété a échoué.",
            "el": "Η εισαγωγή των κριτικών της ιδιοκτησίας σας απέτυχε.",
            "pt": "A importação das avaliações do seu imóvel falhou."
        },
        'photos_failed': {
            "en": "The import of your property photos has failed.",
            "de": "Der Import Ihrer Immobilienfotos ist fehlgeschlagen.",
            "it": "L'importazione delle foto della tua proprietà è fallita.",
            "es": "La importación de las fotos de su propiedad ha fallado.",
            "fr": "L'importation des photos de votre propriété a échoué.",
            "el": "Η εισαγωγή των φωτογραφιών της ιδιοκτησίας σας απέτυχε.",
            "pt": "A importação das fotos do seu imóvel falhou."
        },
        'facebook_reviews': {
            "en": "The import of your Facebook reviews has completed successfully.",
            "de":
                "Der Import Ihrer Facebook-Bewertungen wurde erfolgreich abgeschlossen.",
            "it":
                "L'importazione delle tue recensioni Facebook è stata completata con successo.",
            "es":
                "La importación de tus reseñas de Facebook se ha completado con éxito.",
            "fr": "L'importation de vos avis Facebook a été réalisée avec succès.",
            "pt":
                "A importação de suas avaliações do Facebook foi concluída com sucesso."
        },
        'facebook_reviews_failed': {
            "en": "The import of your Facebook reviews has failed.",
            "de": "Der Import Ihrer Facebook-Bewertungen ist fehlgeschlagen.",
            "it": "L'importazione delle tue recensioni Facebook è fallita.",
            "es": "La importación de tus reseñas de Facebook ha fallado.",
            "fr": "L'importation de vos avis Facebook a échoué.",
            "pt": "A importação de suas avaliações do Facebook falhou."
        },
        'google_reviews': {
            "en": "The import of your Google reviews has completed successfully.",
            "de":
                "Der Import Ihrer Google-Bewertungen wurde erfolgreich abgeschlossen.",
            "it":
                "L'importazione delle tue recensioni Google è stata completata con successo.",
            "es":
                "La importación de tus reseñas de Google se ha completado con éxito.",
            "fr": "L'importation de vos avis Google a été réalisée avec succès.",
            "pt":
                "A importação de suas avaliações do Google foi concluída com sucesso."
        },
        'google_reviews_failed': {
            "en": "The import of your Google reviews has failed.",
            "de": "Der Import Ihrer Google-Bewertungen ist fehlgeschlagen.",
            "it": "L'importazione delle tue recensioni Google è fallita.",
            "es": "La importación de tus reseñas de Google ha fallado.",
            "fr": "L'importation de vos avis Google a échoué.",
            "pt": "A importação de suas avaliações do Google falhou."
        },
        "excel_property_failed": {
            "en":
                "Your property import has failed at row {row}. Required fields are missing.",
            "de":
                "Der Import Ihrer Immobilie ist in Zeile {row} fehlgeschlagen. Erforderliche Felder fehlen.",
            "it":
                "L'importazione della tua proprietà è fallita alla riga {row}. Manca di campi richiesti.",
            "es":
                "La importación de su propiedad ha fallado en la fila {row}. Faltan campos obligatorios.",
            "fr":
                "L'importation de votre propriété a échoué à la ligne {row}. Il manque des champs obligatoires.",
            "el":
                "Η εισαγωγή της ιδιοκτησίας σας απέτυχε στη σειρά {row}. Λείπουν απαραίτητα πεδία.",
            "pt":
                "A importação do seu imóvel falhou na linha {row}. Faltam campos obrigatórios."
        },
        "excel_field_error": {
            "en": "There is a field validation error at column {column}, row {row}.",
            "de":
                "Es gibt einen Feldvalidierungsfehler in Spalte {column}, Zeile {row}.",
            "it":
                "C'è un errore di validazione del campo nella colonna {column}, riga {row}.",
            "es":
                "Hay un error de validación de campo en la columna {column}, fila {row}.",
            "fr":
                "Il y a une erreur de validation de champ dans la colonne {column}, ligne {row}.",
            "el": "Υπάρχει σφάλμα επικύρωσης πεδίου στη στήλη {column}, σειρά {row}.",
            "pt": "Há um erro de validação de campo na coluna {column}, linha {row}."
        },
        "booking_excel_field_error": {
            "en":
                "There is a validation error while importing bookings at column {column}, row {row} in sheet \"{sheet}\".",
            "de":
                "Es gibt einen Validierungsfehler beim Importieren von Buchungen in Spalte {column}, Zeile {row} im Blatt \"{sheet}\".",
            "it":
                "C'è un errore di validazione durante l'importazione delle prenotazioni nella colonna {column}, riga {row} nel foglio \"{sheet}\".",
            "es":
                "Hay un error de validación al importar reservas en la columna {column}, fila {row} en la hoja \"{sheet}\".",
            "fr":
                "Il y a une erreur de validation lors de l'importation des réservations dans la colonne {column}, ligne {row} dans la feuille \"{sheet}\".",
            "el":
                "Υπάρχει σφάλμα επικύρωσης κατά την εισαγωγή κρατήσεων στη στήλη {column}, σειρά {row} στο φύλλο \"{sheet}\".",
            "pt":
                "Há um erro de validação ao importar reservas na coluna {column}, linha {row} na folha \"{sheet}\"."
        },
        "departure_validation_error": {
            "en":
                "The departure date should be after the arrival date at row {row} in sheet \"{sheet}\".",
            "de":
                "Das Abreisedatum sollte nach dem Ankunftsdatum in Zeile {row} im Blatt \"{sheet}\" liegen.",
            "it":
                "La data di partenza dovrebbe essere dopo la data di arrivo alla riga {row} nel foglio \"{sheet}\".",
            "es":
                "La fecha de salida debe ser posterior a la fecha de llegada en la fila {row} en la hoja \"{sheet}\".",
            "fr":
                "La date de départ doit être postérieure à la date d'arrivée à la ligne {row} dans la feuille \"{sheet}\".",
            "el":
                "Η ημερομηνία αναχώρησης πρέπει να είναι μετά την ημερομηνία άφιξης στη σειρά {row} στο φύλλο \"{sheet}\".",
            "pt":
                "A data de partida deve ser após a data de chegada na linha {row} na folha \"{sheet}\"."
        },
        "booking_overlap_error": {
            "en":
                "You already have a booking from {existingArrival} to {existingDeparture}. The new booking from {newArrival} to {newDeparture} conflicts.",
            "de":
                "Sie haben bereits eine Buchung vom {existingArrival} bis zum {existingDeparture}. Die neue Buchung vom {newArrival} bis zum {newDeparture} steht im Konflikt.",
            "it":
                "Hai già una prenotazione dal {existingArrival} al {existingDeparture}. La nuova prenotazione dal {newArrival} al {newDeparture} è in conflitto.",
            "es":
                "Ya tienes una reserva desde el {existingArrival} hasta el {existingDeparture}. La nueva reserva desde el {newArrival} hasta el {newDeparture} entra en conflicto.",
            "fr":
                "Vous avez déjà une réservation du {existingArrival} au {existingDeparture}. La nouvelle réservation du {newArrival} au {newDeparture} est en conflit.",
            "el":
                "Έχετε ήδη μια κράτηση από {existingArrival} έως {existingDeparture}. Η νέα κράτηση από {newArrival} έως {newDeparture} έχει σύγκρουση.",
            "pt":
                "Você já tem uma reserva de {existingArrival} até {existingDeparture}. A nova reserva de {newArrival} até {newDeparture} entra em conflito."
        },
        "booking_overlap_error_sheet": {
            "en":
                "You already have a booking from {existingArrival} to {existingDeparture}. The new booking from {newArrival} to {newDeparture} in sheet \"{sheet}\" conflicts.",
            "de":
                "Sie haben bereits eine Buchung vom {existingArrival} bis zum {existingDeparture}. Die neue Buchung vom {newArrival} bis zum {newDeparture} im Blatt \"{sheet}\" steht im Konflikt.",
            "it":
                "Hai già una prenotazione dal {existingArrival} al {existingDeparture}. La nuova prenotazione dal {newArrival} al {newDeparture} nel foglio \"{sheet}\" è in conflitto.",
            "es":
                "Ya tienes una reserva desde el {existingArrival} hasta el {existingDeparture}. La nueva reserva desde el {newArrival} hasta el {newDeparture} en la hoja \"{sheet}\" entra en conflicto.",
            "fr":
                "Vous avez déjà une réservation du {existingArrival} au {existingDeparture}. La nouvelle réservation du {newArrival} au {newDeparture} dans la feuille \"{sheet}\" est en conflit.",
            "el":
                "Έχετε ήδη μια κράτηση από {existingArrival} έως {existingDeparture}. Η νέα κράτηση από {newArrival} έως {newDeparture} στο φύλλο \"{sheet}\" έχει σύγκρουση.",
            "pt":
                "Você já tem uma reserva de {existingArrival} até {existingDeparture}. A nova reserva de {newArrival} até {newDeparture} na folha \"{sheet}\" entra em conflito."
        },
    };


    // Default message if type or language code doesn't exist
    let message = messages[type] && messages[type][langCode] ? messages[type][langCode] : 'N/A';

    // Check if URL needs to be parsed for placeholders
    if (urlRef && !urlRef.includes('http')) {
        const splitFields = urlRef.split(',');
        splitFields.forEach(field => {
            const parts = field.split('-');
            if (parts.length > 1) {
                message = message.replace(`{${parts[0]}}`, parts[1]);
            }
        });
    }

    return message;

    /// MODIFY CODE ONLY ABOVE THIS LINE
}
