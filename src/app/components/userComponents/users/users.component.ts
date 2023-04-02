import { Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';  
import { MapsAPILoader } from "@agm/core";
import { CropsService } from 'src/app/services/cropsService/crops.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  submitted: boolean | undefined;
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
    timePeriod: new FormControl('', Validators.required)
  });

  get cropName():any { return this.addCropForm.get('cropName') }
  get description():any { return this.addCropForm.get('description') }
  get imageUrl():any { return this.addCropForm.get('imageUrl') }
  get waterRequiredPerSqFeet():any { return this.addCropForm.get('waterRequiredPerSqFeet') }
  get timePeriod():any { return this.addCropForm.get('timePeriod') }

  addCrop() {                                                                     
    this.submitted = true;
    if (this.addCropForm.valid) {
      this.cropsService.createCrop(this.addCropForm.value).subscribe((res: any) => {
        console.log(res);
      })
    }
    this.getCrops();
    this.addCropForm.reset();
    this.addCropForm.markAsPristine();
    this.addCropForm.markAsUntouched();
    this.addCropForm.updateValueAndValidity();
    this.submitted = false;
    this.closeAddCropPopUp.nativeElement.click();
  }

  getCrops() {
    this.cropsService.getCrops().subscribe((res: any) => {
      if (res && res.data) {
        this.cropsData = res.data;
      }
    })
  }

  editCrop(item: any) {
    this.cropsService.updateCrop(item).subscribe((res: any) => {
      console.log("Res", res);
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
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude:any, longitude:any) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results:any, status:any) => {
      console.log(results);
      console.log(status);
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
