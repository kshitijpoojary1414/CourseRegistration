const db = require("./db/db")

async function yes() {
//   const ans = await db.select("*")
//     .from("courseregistrations")
//     .where({
//         course_id: 1
//     })
//     .rightJoin('users', 'users.id', 'courseregistrations.user_id')
//     .leftJoin('courses','courses.id','courseregistrations.course_id')

    const ans = await db('courses').where({
        'courses.id' : "0a2cea01-df3c-4d87-bfc5-f79a1234f88f",
        "courses.is_active": true        
    })
    .select("*")
===
  //console.log(ans)
}

yes()