export default class Station {
  /* eslint-disable */
  constructor(public hasKeyDispenser: boolean, public externalId: string, public stationId: string, public shortName: string,
        public name: string, public hasKiosk: boolean, public rentalUris: {ios: string, android: string}, public stationServices: string[],
        public rentalMethods: string[], public electricBikeWaiver: boolean, public lat: number, public long: number, public capacity: number) {

  }
}
