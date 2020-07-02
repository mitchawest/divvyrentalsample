export default class Trip {
    rentalId: number;

    startTime: Date;

    endTime: Date;

    bikeId: number;

    durationSeconds: number;

    startStationId: number;

    startStationName: string;

    endStationId: number;

    endStationName: string;

    userType: string;

    userGender: string;

    userBirthYear: number;

    estimatedUserAge: number;

    constructor(tripString: string) {
      /* scrub commas from duration in order to comma-delimit data fields */
      let newTripString = '';
      const tempTripStringArray = tripString.split('"');
      if (tempTripStringArray.length === 3) {
        tempTripStringArray[1] = tempTripStringArray[1].replace(/,/g, '');
        newTripString = tempTripStringArray.join('');
      } else {
        [newTripString] = tempTripStringArray;
      }
      const [rentalId, startTime, endTime, bikeId, durationSeconds, startStationId, startStationName, endStationId,
        endStationName, userType, userGender, userBirthYear] = newTripString.split(',');
      this.rentalId = rentalId ? Number(rentalId) : null;
      this.startTime = startTime ? new Date(startTime) : null;
      this.endTime = endTime ? new Date(endTime) : null;
      this.bikeId = bikeId ? Number(bikeId) : null;
      this.durationSeconds = durationSeconds ? Number(durationSeconds) : null;
      this.startStationId = startStationId ? Number(startStationId) : null;
      this.startStationName = startStationName || null;
      this.endStationId = endStationId ? Number(endStationId) : null;
      this.endStationName = endStationName || null;
      this.userType = userType || null;
      this.userGender = userGender || null;
      this.userBirthYear = userBirthYear ? Number(userBirthYear) : null;
      this.estimatedUserAge = this.userBirthYear ? new Date().getFullYear() - this.userBirthYear : null;
    }
}
