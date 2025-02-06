// services.js

// Create Service (Admin)
function createService() {
    const serviceName = prompt("Enter service name:");
    const serviceDescription = prompt("Enter service description:");

    const newService = {
        name: serviceName,
        description: serviceDescription,
        status: 'Active'
    };

    db.collection('services').add(newService)
        .then(() => {
            alert('Service created successfully');
        })
        .catch((error) => {
            console.error('Error creating service', error);
        });
}

// Fetch Services (User)
function fetchServices() {
    db.collection('services').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
            });
        })
        .catch((error) => {
            console.error('Error getting services', error);
        });
}
