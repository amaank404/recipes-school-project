def executescript(conn, script):
    with conn.cursor() as cur:
        for x in script.split(";"):
            q = x.replace("\n", " ").replace("\r", " ")
            if q.strip() == "":
                continue
            try:
                cur.execute(q)
            except:
                print(q)
                raise
    conn.commit()
