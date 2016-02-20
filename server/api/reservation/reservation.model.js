'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Reservation', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FIRST: DataTypes.STRING(50),
    LAST:	DataTypes.STRING(50),
    WEIGHT:	DataTypes.INTEGER,
    FWeight:	DataTypes.INTEGER,
    "DATE TO FLY":	DataTypes.DATE,
    smfltnum:	DataTypes.STRING(50),
    "FLIGHT#":	DataTypes.STRING(50),
    "INVOICE#":	DataTypes.STRING(75),
    "Ref#":	DataTypes.INTEGER,
    Daytrip:	DataTypes.CHAR(1),
    "DATE RESERVED":	DataTypes.DATE,
    dinit:	DataTypes.STRING(50),
    dpaxy:	DataTypes.CHAR(1),
    PILOT:	DataTypes.STRING(50),
    AIRCRAFT:	DataTypes.STRING(50),
    Comment:	DataTypes.STRING(255),
    Phone:	DataTypes.STRING(50),
    dbag:	DataTypes.INTEGER,
    dblank:	DataTypes.STRING(50),
    dest:	DataTypes.STRING(50),
    "Depart Time":	DataTypes.DATE,
    "dReturn TIme":	DataTypes.DATE,
    dFirst:	DataTypes.STRING(50),
    Homer:	DataTypes.INTEGER,
    "CREDIT CARD":	DataTypes.STRING(50),
    EXP:	DataTypes.STRING(50),
    "I#":	DataTypes.INTEGER,
    "NO SHOW":	DataTypes.CHAR(1),
    ItineraryRef:	DataTypes.INTEGER,
    section:	DataTypes.INTEGER,
    email:	DataTypes.STRING(50),
    mailed:	DataTypes.CHAR(1),
    Revenue:  DataTypes.DECIMAL,	
    Count:	DataTypes.INTEGER,
    Index1:	DataTypes.INTEGER,
    ArrTime:	DataTypes.DATE,
    "Advanced Booking":	DataTypes.CHAR(1),
    RandomRank:	DataTypes.DECIMAL,	
    UPDATED:	DataTypes.DATE,
    uid: DataTypes.STRING(255)
    
    
  });
}
