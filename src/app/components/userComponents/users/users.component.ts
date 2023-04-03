import { Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';  
import { MapsAPILoader } from "@agm/core";
import { CropsService } from 'src/app/services/cropsService/crops.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {

  cropsData: any;
  title: string = 'AGM project';
  latitude: any;
  longitude: any;
  zoom: any;
  address: any;
  userType: any;
  submitted: boolean | undefined;
  months = [{ id: 1, month: 'January' }, { id: 2, month: 'February' }, { id: 3, month: 'March' }, { id: 4, month: 'April' }, { id: 5, month: 'May' },
  { id: 6, month: 'June' }, { id: 7, month: 'July' }, { id: 8, month: 'August' }, { id: 9, month: 'September' }, { id: 10, month: 'October' }, { id: 11, month: 'November' }, { id: 12, month: 'December' }]
  private geoCoder: any;
  @ViewChild('closeAddCropPopUp') closeAddCropPopUp: any;
  @ViewChild('search')
  public searchElementRef: any;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private cropsService: CropsService
  ) { }

  ngOnInit(): void {
  this.userType = localStorage.getItem('userType');
  this.mapsAPILoader.load().then(() => {
    this.setCurrentLocation();
    this.geoCoder = new google.maps.Geocoder;

    let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        //set latitude, longitude and zoom
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.zoom = 12;
      });
    });
  });

  this.getCrops();
  }
  
  addCropForm = new FormGroup({
    cropName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required),
    waterRequiredPerSqFeet: new FormControl('', Validators.required),
    timePeriod: new FormControl('', Validators.required),
    startSeason: new FormControl('', Validators.required),
    endSeason: new FormControl('', Validators.required)
  });

  get cropName():any { return this.addCropForm.get('cropName') }
  get description():any { return this.addCropForm.get('description') }
  get imageUrl():any { return this.addCropForm.get('imageUrl') }
  get waterRequiredPerSqFeet():any { return this.addCropForm.get('waterRequiredPerSqFeet') }
  get timePeriod():any { return this.addCropForm.get('timePeriod') }
  get startSeason():any { return this.addCropForm.get('startSeason') }
  get endSeason():any { return this.addCropForm.get('endSeason') }


  addCrop() {                                                                     
    this.submitted = true;
    if (this.addCropForm.valid) {
      this.cropsService.createCrop(this.addCropForm.value).subscribe((res: any) => {
        this.getCrops();
        this.addCropForm.reset();
        this.addCropForm.markAsPristine();
        this.addCropForm.markAsUntouched();
        this.addCropForm.updateValueAndValidity();
        this.submitted = false;
        this.closeAddCropPopUp.nativeElement.click();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500  
        })
      }, (err) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: err.error.error,
          showConfirmButton: false,
          timer: 1500
        })
      })
    }
  }

  getCrops() {
    this.cropsService.getCrops().subscribe((res: any) => {
      if (this.userType == 'farm analyzer') {
        this.cropsData = res.data.filter((item: any): any => {
          return item.owned
        })
      } else {
        this.cropsData = res.data;
      }
  })
  }

  editCropForm = new FormGroup({
    _id: new FormControl(''),
    cropName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required),
    waterRequiredPerSqFeet: new FormControl('', Validators.required),
    timePeriod: new FormControl('', Validators.required),
    startSeason: new FormControl('', Validators.required),
    endSeason: new FormControl('', Validators.required),
    owned: new FormControl('')
  });

  editCrop(item: any) {
    console.log("item", item);
    this.editCropForm.patchValue({
      _id: item._id,
      cropName: item && item.cropName,
      description: item && item.description,
      imageUrl: item && item.imageUrl,
      waterRequiredPerSqFeet: item && item.waterRequiredPerSqFeet,
      timePeriod: item && item.timePeriod,
      startSeason: item && item.startSeason,
      endSeason: item && item.endSeason,
      owned: item && item.owned
    });
    console.log("editCropForm", this.editCropForm.value);
  }

  editCropDialog() {
    this.cropsService.updateCrop(this.editCropForm.value).subscribe((res: any) => {
      if (res && res.data) {
        this.addCropForm.reset();
      this.addCropForm.markAsPristine();
      this.addCropForm.markAsUntouched();
      this.addCropForm.updateValueAndValidity();
      this.submitted = false;
      this.closeAddCropPopUp.nativeElement.click();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500  
      })
      }
    }, (err) => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: err.error.error,
        showConfirmButton: false,
        timer: 1500
      })
    })
    
  }
 
  deleteCrop(item: any) {
    this.cropsService.deleteCrop(item._id).subscribe((res: any) => {});
    this.getCrops();
  }



  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
      });
    }
  }

  markerDragEnd($event: any) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude:any, longitude:any) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results:any, status:any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

}
