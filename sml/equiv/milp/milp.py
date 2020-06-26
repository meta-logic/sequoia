    # Sequoia  Copyright (C) 2020  Mohammed Hashim
    # This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    # This is free software, and you are welcome to redistribute it
    # under certain conditions; see LICENSE for details.



import sys
import os


def get_out():
    try:
        return os.fdopen(10,'w')
    except OSError:
        return os.fdopen(1,'w')


nl = os.open(os.devnull,os.O_WRONLY)
temp = 15
temp2 = 16

stdout = 1
stderr = 2

os.dup2(stdout,temp)
os.dup2(nl,stdout)

os.dup2(stderr,temp2)
os.dup2(nl,stderr)



from mip.model import *
from mip.constants import *



#print(os.listdir('/proc/self/fd'))




f = sys.stdin
if (len(sys.argv)>=3):
	file = sys.argv[2]
	f = open(file,"r")	

w = os.fdopen(nl,'w')
if len(sys.argv)>=2:
	log = sys.argv[1]
	w = open(log,"a")


w.write("_________________________________________________\n")




	

row_num, var_num, t1_num = list(map(int,f.readline().split(" ")))

# variables = f.readline().strip().split(" ")
# w.write(" ".join(variables)+"\n")
# assert(len(variables)==var_num)




def get_model():
    m = Model("test",solver_name='cbc')
    return m

m = get_model()


m.verbose = 0



#m.setParam("OutputFlag",0)

rows = [0]*row_num
for i in range(row_num):
	rows[i] = list(map(int,f.readline().split(" ")))

f.close()
# each row : (g,gp,g1p,g2p)

#always square
unifier = [0]*var_num
for i in range(var_num):
	unifier[i] = [0]*var_num

for i in range(t1_num):
	for j in range(var_num):
		unifier[i][j] = m.add_var(var_type=BINARY,name = 't1, var: %d to %d'%(i,j))
for i in range(t1_num,var_num):
	for j in range(var_num):
		unifier [i][j] = m.add_var(var_type = INTEGER,lb=0,name = 't2, var: %d to %d'%(i,j))

for i in range(row_num):
	for j in range(var_num):
                m += xsum(rows[i][var]*unifier[var][j] for var in range(var_num))==0
for i in range(t1_num):
        m+= xsum(unifier[i][j] for j in range(var_num)) >= 1

m.emphasis=1
status = m.optimize()

os.dup2(temp,stdout)
os.dup2(temp2,stderr)


solved = (status == OptimizationStatus.OPTIMAL) or (status == OptimizationStatus.FEASIBLE)

sml_out = get_out()
res = ("%d\n"%(int(solved)))
sml_out.write(res)
sml_out.close()
w.write(str(solved) + "\n")
if (solved):
	unifier = list(map((lambda x : list(map(lambda y: int(y.x),x))),unifier))
	for i in range(len(unifier)):
		w.write(" ".join(map(str,unifier[i])) +"\n")

w.close()
if (os.isatty(nl)):
    os.close(nl)
