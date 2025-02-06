// status.js

// View Application Status (User)
function viewApplicationStatus() {
    const userId = auth.currentUser.uid;
    
    db.collection('applications').where("userId", "==", userId).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
            });
        })
        .catch((error) => {
            console.error('Error fetching application status', error);
        });
}

// Update Application Status (Admin)
function updateApplicationStatus(applicationId, status) {
    db.collection('applications').doc(applicationId).update({
        status: status
    })
    .then(() => {
        alert('Application status updated');
    })
    .catch((error) => {
        console.error('Error updating status', error);
    });
}
