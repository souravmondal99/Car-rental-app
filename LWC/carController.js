import { LightningElement, wire, track } from 'lwc';
import fetchCars from '@salesforce/apex/CarController.fetchCars';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Sample extends LightningElement {

    records;
    sortedColumn;
    sortedDirection = 'asc';
    initialRecords;
    @track carId = '';
    @track isModalOpen = false;

    @wire(fetchCars)
    wiredAccount({ error, data }) {
        if (data) {

            this.records = data;
            this.initialRecords = data;
            this.error = undefined;

        } else if (error) {

            this.error = error;
            this.initialRecords = undefined;
            this.records = undefined;

        }
    }


    handleKeyChange(event) {
        const searchKey = event.target.value.toLowerCase();
        console.log('Search Key is ' + searchKey);

        if (searchKey) {
            this.records = this.initialRecords;
            if (this.records) {
                let recs = [];
                for (let rec of this.records) {
                    console.log('Rec is ' + JSON.stringify(rec));
                    let valuesArray = Object.values(rec);
                    console.log('valuesArray is ' + valuesArray);

                    for (let val of valuesArray) {
                        if (val) {
                            if (val.toLowerCase().includes(searchKey)) {
                                recs.push(rec);
                                break;

                            }

                        }
                    }
                }

                console.log('Recs are ' + JSON.stringify(recs));
                this.records = recs;

            }

        } else {

            this.records = this.initialRecords;

        }

    }


    handleClick(event) {
        this.isModalOpen = true;
        this.carId = event.target.dataset.id;


    }

    closeModal() {
        this.isModalOpen = false;
    }

    handleError(event) {
        const demo = new ShowToastEvent({
            title: 'Error',
            message: event.detail.error,
            variant: 'error'

        });
        this.dispatchEvent(demo);
    }

    handleSave() {
        this.isModalOpen = false;
        const demo = new ShowToastEvent({
            title: 'Success',
            message: 'Booking is Confirmed!',
            variant: 'success'

        });
        this.dispatchEvent(demo);
    }

}