app.get('/duration/:days', async (req, res) => {
    // const { employeeCode, dateId } = req.params;
    const token = req.headers.authorization
    const employeeCode = verifyTokenAndGetId(token)
  
    const date = await getCurrentDate(0);
  
    try {
      const result = await sequelize2.query(
        'SELECT TIMEDIFF(end_time, start_time) AS time_diff FROM loginlogs WHERE employeecode = :employeeCode AND date = :date',
        {
          replacements: { employeeCode:employeeCode , date: '2023-04-13' },
          type: sequelize2.QueryTypes.SELECT
        }
      )
      if (result && result.length > 0) {
        const duration = result[0].time_diff
        res.json({ duration })
      } else {
        res.status(404).json({ message: 'Duration not found' })
      }
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal server error' })
    }
  })
  app.get('/duration/:days', async (req, res) => {
    const { days } = req.params;
    const token = req.headers.authorization;
    const employeeCode = verifyTokenAndGetId(token);
    
    const currentDate = await getCurrentDate(0);
    const startDate = await getCurrentDate(days-1);
    
    try {
      const result = await sequelize2.query(
        `SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_time, start_time)))) AS total_duration 
         FROM loginlogs 
         WHERE employeecode = :employeeCode 
         AND date BETWEEN :startDate AND :endDate`,
        {
          replacements: { 
            employeeCode,
            startDate,
            endDate: currentDate
          },
          type: sequelize2.QueryTypes.SELECT
        }
      )
      
      if (result && result.length > 0) {
        const totalDuration = result[0].total_duration;
        res.json({ totalDuration })
      } else {
        res.status(404).json({ message: 'Duration not found' })
      }
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal server error' })
    }
  })  